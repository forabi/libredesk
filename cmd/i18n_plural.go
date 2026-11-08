package main

import (
	"encoding/json"
	"strconv"
	"strings"

	"github.com/knadh/go-i18n"
	"golang.org/x/text/feature/plural"
	"golang.org/x/text/language"
)

// cldrOrder is the order translators list plural forms in: zero | one | two | few | many | other.
var cldrOrder = []plural.Form{plural.Zero, plural.One, plural.Two, plural.Few, plural.Many, plural.Other}

// langPack is a language pack whose Tc follows the language's CLDR plural
// rules, matching the frontend's plural rule (shared-ui/utils/plural.js).
//
// The CLDR choice applies only when a value lists exactly one form per plural
// category of its language and the language has more than three categories,
// e.g. Arabic's six (zero | one | two | few | many | other). Everything else
// keeps go-i18n's singular/plural choice, so existing translations render as
// before.
type langPack struct {
	*i18n.I18n
	tag   language.Tag
	raw   map[string]string
	forms []plural.Form
}

func newLangPack(i *i18n.I18n, code string) *langPack {
	raw := map[string]string{}
	_ = json.Unmarshal(i.JSON(), &raw)
	tag := language.Make(code)
	return &langPack{I18n: i, tag: tag, raw: raw, forms: pluralForms(tag)}
}

// pluralForms returns the plural categories a language uses, in CLDR order.
func pluralForms(tag language.Tag) []plural.Form {
	seen := map[plural.Form]bool{}
	for n := 0; n <= 200; n++ {
		seen[plural.Cardinal.MatchPlural(tag, n, 0, 0, 0, 0)] = true
	}
	for _, n := range []int{1000, 10000, 100000, 1000000} {
		seen[plural.Cardinal.MatchPlural(tag, n, 0, 0, 0, 0)] = true
	}
	var forms []plural.Form
	for _, f := range cldrOrder {
		if seen[f] {
			forms = append(forms, f)
		}
	}
	return forms
}

// Tc returns the plural form of key for n.
func (l *langPack) Tc(key string, n int) string {
	if s, ok := l.raw[key]; ok && len(l.forms) > 3 {
		chunks := strings.Split(s, "|")
		if len(chunks) == len(l.forms) {
			if n < 0 {
				n = -n
			}
			form := plural.Cardinal.MatchPlural(l.tag, n, 0, 0, 0, 0)
			for idx, f := range l.forms {
				if f == form {
					return strings.TrimSpace(chunks[idx])
				}
			}
		}
	}
	return l.I18n.Tc(key, n)
}

// Forms returns the raw "a | b | …" value of key, for client-side plural choice.
func (l *langPack) Forms(key string) string {
	if s, ok := l.raw[key]; ok {
		return s
	}
	return key
}

// Tcn is Tc with the count substituted for {count} and {n}, for strings that
// carry their own number ("{count} articles"). Languages such as Arabic place
// or drop the number depending on the form, so templates print counts this way.
func (l *langPack) Tcn(key string, n int) string {
	c := strconv.Itoa(n)
	return strings.NewReplacer("{count}", c, "{n}", c).Replace(l.Tc(key, n))
}

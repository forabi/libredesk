package main

import (
	"testing"

	"github.com/knadh/go-i18n"
)

func newTestPack(t *testing.T, code, json string) *langPack {
	t.Helper()
	i, err := i18n.New([]byte(json))
	if err != nil {
		t.Fatal(err)
	}
	return newLangPack(i, code)
}

func TestLangPackArabicPlurals(t *testing.T) {
	p := newTestPack(t, "ar-SY", `{
		"_.code": "ar-SY", "_.name": "العربية",
		"articles": "لا توجد مقالات | مقالة واحدة | مقالتان | {count} مقالات | {count} مقالة | {count} مقالة",
		"label": "مقالة | مقالات"
	}`)
	for n, want := range map[int]string{
		0: "لا توجد مقالات", 1: "مقالة واحدة", 2: "مقالتان", 3: "3 مقالات",
		10: "10 مقالات", 11: "11 مقالة", 99: "99 مقالة", 100: "100 مقالة", 103: "103 مقالات",
	} {
		if got := p.Tcn("articles", n); got != want {
			t.Errorf("Tcn(%d) = %q, want %q", n, got, want)
		}
	}
	// Two-form labels keep go-i18n's singular/plural choice.
	if got := p.Tc("label", 2); got != "مقالات" {
		t.Errorf("label plural = %q", got)
	}
	if got := p.Tc("label", 1); got != "مقالة" {
		t.Errorf("label singular = %q", got)
	}
}

func TestLangPackEnglishUnchanged(t *testing.T) {
	p := newTestPack(t, "en-US", `{"_.code": "en-US", "_.name": "English", "a": "{count} article | {count} articles"}`)
	for n, want := range map[int]string{1: "1 article", 2: "2 articles", 7: "7 articles"} {
		if got := p.Tcn("a", n); got != want {
			t.Errorf("Tcn(%d) = %q, want %q", n, got, want)
		}
	}
	if got := p.Forms("a"); got != "{count} article | {count} articles" {
		t.Errorf("Forms = %q", got)
	}
}

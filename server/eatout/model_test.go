package eatout

import (
	"reflect"
	"testing"
)

func init() {
	PLACES_PATH = "../../data/places"
}

func TestReadPlace(t *testing.T) {
	place, err := ReadPlace("a-magica")
	if err != nil {
		t.Error("Got error", err)
	}

	expectedSlug := "a-magica"
	if place.Slug != expectedSlug {
		t.Error("Expected:", expectedSlug, "\nValue:", place.Slug)
	}

	expectedImages := []string{
		"data/places/a-magica/images/cover.JPG",
		"data/places/a-magica/images/image1.JPG",
		"data/places/a-magica/images/image2.JPG",
		"data/places/a-magica/images/image3.JPG",
	}
	if reflect.DeepEqual(place.Images, expectedImages) {
		t.Error("Expected:", expectedImages, "\nValue:", place.Images)
	}
}

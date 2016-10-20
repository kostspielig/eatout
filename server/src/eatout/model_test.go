/*
 * eatout - yummy places in the hood
 * Copyright (C) 2014-2016 Maria Carrasco Rodriguez
 *
 * This file is part of eatout.
 *
 * eatout is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * eatout is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with eatout.  If not, see <http://www.gnu.org/licenses/>.
 */

package eatout

import (
	"reflect"
	"testing"
)

func init() {
	PLACES_PATH = "../../../data/places"
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

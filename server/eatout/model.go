package eatout

import (
	"github.com/ghodss/yaml"
	"io/ioutil"
	"log"
	"os"
)

type Place struct {
	Name        string   `json:"name"`
	Url         string   `json:"url"`
	Address     string   `json:"address"`
	District    string   `json:"district"`
	Date        string   `json:"date"`
	FoodType    string   `json:"foodtype"`
	Lat         float64  `json:"lat"`
	Lng         float64  `json:"lng"`
	Rating      float64  `json:"rating"`
	PriceRange  float64  `json:"pricerange"`
	Phone       string   `json:"phone"`
	Recommended bool     `json:"recommended"`
	Closed      bool     `json:"closed"`
	Images      []string `json:"images"`
	Title       string   `json:"title"`
	Description string   `json:"description"`
}

const (
	PLACES_PATH = "data/places"
)

func ReadAllPlaces() ([]Place, error) {
	dataDir, err := os.Open(PLACES_PATH)
	if err != nil {
		return nil, err
	}
	defer dataDir.Close()

	contents, err := dataDir.Readdir(0)
	if err != nil {
		return nil, err
	}

	places := make([]Place, 0, len(contents))
	for _, item := range contents {
		if item.IsDir() {
			placeName := item.Name()
			place, err := ReadPlace(placeName)
			if err != nil {
				log.Println("Could not read place:", placeName)
			} else {
				places = append(places, place)
			}
		}
	}

	return places, nil
}

func ReadPlace(placeName string) (Place, error) {
	placePath := PLACES_PATH + "/" + placeName
	placeYAML, err := ioutil.ReadFile(placePath + "/place.yaml")
	if err != nil {
		return Place{}, err
	}

	place := Place{}
	err = yaml.Unmarshal(placeYAML, &place)
	if err != nil {
		return Place{}, err
	}

	return place, nil
}

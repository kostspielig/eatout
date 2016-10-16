package eatout

import (
	"encoding/json"
	"fmt"
	"github.com/ghodss/yaml"
	"io/ioutil"
	"log"
	"net/http"
	"os"
)

func Start() {
	fmt.Println("Start, babe!")
	http.HandleFunc("/api/places.json", handleApiPlaces)
	http.ListenAndServe(":4000", nil)
}

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

func handleApiPlaces(w http.ResponseWriter, r *http.Request) {
	dataDir, err := os.Open("data/places")
	if err != nil {
		log.Fatal(err)
	}
	defer dataDir.Close()

	contents, err := dataDir.Readdir(0)
	if err != nil {
		log.Fatal(err)
	}

	places := make([]Place, 0, len(contents))
	for _, item := range contents {
		if item.IsDir() {
			placePath := "data/places/" + item.Name() + "/place.yaml"
			placeYAML, err := ioutil.ReadFile(placePath)
			if err != nil {
				continue
			}
			place := Place{}
			err = yaml.Unmarshal(placeYAML, &place)
			if err != nil {
				fmt.Println("Error processing:", placePath)
				fmt.Println(err)
				continue
			}
			places = append(places, place)
		}
	}

	placesJSON, err := json.Marshal(places)
	if err != nil {
		log.Fatal(err)
	}

	w.Write(placesJSON)
}

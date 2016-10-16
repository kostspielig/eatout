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

func HandleApiPlaces(w http.ResponseWriter, r *http.Request) {
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

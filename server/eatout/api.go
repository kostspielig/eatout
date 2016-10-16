package eatout

import (
	"encoding/json"
	"log"
	"net/http"
)

func HandleApiPlaces(w http.ResponseWriter, r *http.Request) {
	places, err := ReadAllPlaces()
	if err != nil {
		log.Fatal(err)
	}

	placesJSON, err := json.Marshal(places)
	if err != nil {
		log.Fatal(err)
	}

	w.Write(placesJSON)
}

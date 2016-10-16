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

	encoder := json.NewEncoder(w)
	encoder.SetEscapeHTML(false)
	encoder.SetIndent("", "    ")

	err = encoder.Encode(places)
	if err != nil {
		log.Fatal(err)
	}
}

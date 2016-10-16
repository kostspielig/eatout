package eatout

import (
	"bytes"
	"encoding/json"
	"log"
	"net/http"
)

var (
	PLACES_JSON = BuildPlacesJSON()
)

func BuildPlacesJSON() []byte {
	places, err := ReadAllPlaces()
	if err != nil {
		log.Fatal(err)
	}

	buf := bytes.Buffer{}
	encoder := json.NewEncoder(&buf)
	encoder.SetEscapeHTML(false)
	encoder.SetIndent("", "    ")
	err = encoder.Encode(places)
	if err != nil {
		log.Fatal(err)
	}

	return buf.Bytes()
}

func HandleApiPlaces(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write(PLACES_JSON)
}

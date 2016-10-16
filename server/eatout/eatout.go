package eatout

import (
	"fmt"
	"net/http"
)

func Start() {
	fmt.Println("Start, babe!")
	http.HandleFunc("/api/places.json", HandleApiPlaces)
	http.ListenAndServe(":4000", nil)
}

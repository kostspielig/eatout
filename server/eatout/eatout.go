
package eatout

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

func Start() {
	fmt.Println("Start, babe!")
	http.HandleFunc("/api/places.json", handleApiPlaces)
	http.ListenAndServe(":4000", nil)
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

	for _, item := range contents {
		if (item.IsDir()) {
			place, err := os.Open("data/places/" + item.Name() + "/place.yaml")
			if (err == nil) {
				fmt.Fprintln(w, "place found:", item.Name())
				place.Close()
			}
		}
	}
}

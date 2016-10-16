package eatout

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"
)

func Start() {
	fmt.Println("Start, babe!")

	http.HandleFunc("/api/places.json", HandleApiPlaces)

	http.Handle("/images/", &StaticServer{"style"})
	http.Handle("/templates/", &StaticServer{"."})
	http.Handle("/dist/", &StaticServer{"."})
	http.Handle("/data/", &StaticServer{"."})

	http.HandleFunc("/favicon.ico", HandleFavicon)
	http.HandleFunc("/", HandleIndex)

	http.ListenAndServe(":4000", nil)
}

func HandleFavicon(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./style/images/favicon.png")
}

func HandleIndex(w http.ResponseWriter, r *http.Request) {
	http.ServeFile(w, r, "./templates/index.html")
}

type StaticServer struct {
	Base string
}

func toHTTPError(err error) (msg string, httpStatus int) {
	if os.IsNotExist(err) {
		return "404 page not found", http.StatusNotFound
	}
	if os.IsPermission(err) {
		return "403 Forbidden", http.StatusForbidden
	}
	return "500 Internal Server Error", http.StatusInternalServerError
}

func (s *StaticServer) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	path := s.Base + "/" + strings.TrimPrefix(r.URL.Path, "/")
	log.Println("Serving file:", path)

	f, err := os.Open(path)
	if err != nil {
		msg, code := toHTTPError(err)
		http.Error(w, msg, code)
		return
	}
	defer f.Close()

	d, err := f.Stat()
	if err != nil {
		msg, code := toHTTPError(err)
		http.Error(w, msg, code)
		return
	}

	if d.IsDir() {
		http.Error(w, "404 page not found", http.StatusNotFound)
		return
	}

	http.ServeContent(w, r, path, d.ModTime(), f)
}

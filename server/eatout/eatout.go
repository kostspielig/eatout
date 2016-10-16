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
	http.Handle("/debug/", http.StripPrefix("/debug", SiteHandler("templates/index-debug.html")))
	http.Handle("/", SiteHandler("templates/index.html"))
	http.ListenAndServe(":4000", nil)
}

func SiteHandler(indexFile string) *http.ServeMux {
	s := http.NewServeMux()

	s.HandleFunc("/api/places.json", HandleApiPlaces)

	s.Handle("/images/", &StaticServer{"style"})
	s.Handle("/templates/", &StaticServer{"."})
	s.Handle("/dist/", &StaticServer{"."})
	s.Handle("/data/", &StaticServer{"."})

	// original sources, for debug mode
	s.Handle("/stylesheets/", &StaticServer{"style"})
	s.Handle("/src/", &StaticServer{"."})
	s.Handle("/lib/", &StaticServer{"."})

	s.HandleFunc("/favicon.ico", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, "./style/images/favicon.png")
	})
	s.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		http.ServeFile(w, r, indexFile)
	})

	return s
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

type StaticServer struct {
	Base string
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

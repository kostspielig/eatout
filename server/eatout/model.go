package eatout

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

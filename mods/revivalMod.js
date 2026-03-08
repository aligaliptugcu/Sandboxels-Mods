
elements.revival = {
    color: "#ffff99", // Parlak, tanrı ışını benzeri bir sarı renk
    behavior: behaviors.POWDER,
    category: "energy",
    state: "gas",
    density: 2,
    desc: "It brings certain materials to life, transforming them into humans",
    tick: function(pixel) {
        // List of elements to be targeted.
        var targets = [
            "ash", "rotten_meat", "cooked_meat", "meat", "treated_meat", "bone", "salt", "oil"
        ];

        // Check the pixel below the beam.
        var down1_x = pixel.x;
        var down1_y = pixel.y + 1;

        if (!isEmpty(down1_x, down1_y, true)) {
            var pixel_down1 = getPixel(down1_x, down1_y);
            var element_down1 = pixel_down1.element;

            // Bir alttaki piksel hedeflerden biri mi diye kontrol et
            var is_target = false;
            for (var i = 0; i < targets.length; i++) {
                if (element_down1 === targets[i]) {
                    is_target = true;
                    break;
                }
            }
            
            if (is_target) {
                // Hedefin de bir altındaki pikseli kontrol et
                var down2_x = pixel.x;
                var down2_y = pixel.y + 2;

                if (!isEmpty(down2_x, down2_y, true)) {
                    var pixel_down2 = getPixel(down2_x, down2_y);
                    var element_down2 = pixel_down2.element;

                    // Eğer iki piksel de aynı hedef element ise
                    if (element_down1 === element_down2) {
                        // Dönüşümü gerçekleştir
                        deletePixel(pixel.x, pixel.y); // Revival ışınını yok et
                        deletePixel(down1_x, down1_y); // İlk hedefi yok et
                        changePixel(pixel_down2, "human"); // İkinci hedefi insana dönüştür
                        return; // İşlemi bitir
                    }
                }
            }
        }

        // Eğer herhangi bir dönüşüm olmadıysa, ışın aşağı doğru hareket etsin
        tryMove(pixel, pixel.x, pixel.y + 1);
        
        // Işın hareket edemiyorsa (bir şeye çarptıysa) veya belirli bir mesafe kat ettiyse kendini yok et.
        // Bu, sonsuza kadar etrafta kalmasını önler.
        if (!pixel.moved) {
            if (pixel.y > (pixel.oy || 0) + 150) { // pixel.oy yoksa 0 kullan
                 deletePixel(pixel.x, pixel.y);
            }
            else {
                var bottomPixel = getPixel(pixel.x, pixel.y+1);
                if (bottomPixel && bottomPixel.element !== "empty") {
                    deletePixel(pixel.x, pixel.y);
                }
            }
        }
    }
};


const imgInput = document.querySelector(".imgInput"),
      filterButtons = document.querySelectorAll(".filter button"),
      filterLabel = document.querySelector(".filter-info .name"),
      filterValueDisplay = document.querySelector(".filter-info .value"),
      filterRange = document.querySelector(".slider input"),
      rotateButtons = document.querySelectorAll(".rotate button"),
      imgPreview = document.querySelector(".preview-img img"),
      clearBtn = document.querySelector(".clearFilters"),
      chooseBtn = document.querySelector(".chooseImage"),
      saveBtn = document.querySelector(".saveImage");

let brightnessVal = "100", saturationVal = "100", inversionVal = "0", grayscaleVal = "0";
let rotateVal = 0, flipH = 1, flipV = 1;

const handleImageUpload = () => {
    let file = imgInput.files[0];
    if (!file) return;
    imgPreview.src = URL.createObjectURL(file);
    imgPreview.addEventListener("load", () => {
        clearBtn.click();
        document.querySelector(".container").classList.remove("disable");
    });
}

const applyImageFilters = () => {
    imgPreview.style.transform = `rotate(${rotateVal}deg) scale(${flipH}, ${flipV})`;
    imgPreview.style.filter = `brightness(${brightnessVal}%) saturate(${saturationVal}%) invert(${inversionVal}%) grayscale(${grayscaleVal}%)`;
}

filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        document.querySelector(".active").classList.remove("active");
        button.classList.add("active");
        filterLabel.innerText = button.innerText;

        if (button.id === "brightness") {
            filterRange.max = "200";
            filterRange.value = brightnessVal;
            filterValueDisplay.innerText = `${brightnessVal}%`;
        } else if (button.id === "saturation") {
            filterRange.max = "200";
            filterRange.value = saturationVal;
            filterValueDisplay.innerText = `${saturationVal}%`;
        } else if (button.id === "inversion") {
            filterRange.max = "100";
            filterRange.value = inversionVal;
            filterValueDisplay.innerText = `${inversionVal}%`;
        } else {
            filterRange.max = "100";
            filterRange.value = grayscaleVal;
            filterValueDisplay.innerText = `${grayscaleVal}%`;
        }
    });
});

const updateFilterValues = () => {
    filterValueDisplay.innerText = `${filterRange.value}%`;
    const activeFilter = document.querySelector(".filter .active");

    if (activeFilter.id === "brightness") {
        brightnessVal = filterRange.value;
    } else if (activeFilter.id === "saturation") {
        saturationVal = filterRange.value;
    } else if (activeFilter.id === "inversion") {
        inversionVal = filterRange.value;
    } else {
        grayscaleVal = filterRange.value;
    }
    applyImageFilters();
}

rotateButtons.forEach(button => {
    button.addEventListener("click", () => {
        if (button.id === "rotateLeft") {
            rotateVal -= 90;
        } else if (button.id === "rotateRight") {
            rotateVal += 90;
        } else if (button.id === "flipH") {
            flipH = flipH === 1 ? -1 : 1;
        } else {
            flipV = flipV === 1 ? -1 : 1;
        }
        applyImageFilters();
    });
});

const resetFilters = () => {
    brightnessVal = "100"; saturationVal = "100"; inversionVal = "0"; grayscaleVal = "0";
    rotateVal = 0; flipH = 1; flipV = 1;
    filterButtons[0].click();
    applyImageFilters();
}

const saveEditedImage = () => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    canvas.width = imgPreview.naturalWidth;
    canvas.height = imgPreview.naturalHeight;
    
    ctx.filter = `brightness(${brightnessVal}%) saturate(${saturationVal}%) invert(${inversionVal}%) grayscale(${grayscaleVal}%)`;
    ctx.translate(canvas.width / 2, canvas.height / 2);
    if (rotateVal !== 0) {
        ctx.rotate(rotateVal * Math.PI / 180);
    }
    ctx.scale(flipH, flipV);
    ctx.drawImage(imgPreview, -canvas.width / 2, -canvas.height / 2, canvas.width, canvas.height);
    
    const link = document.createElement("a");
    link.download = "image.jpg";
    link.href = canvas.toDataURL();
    link.click();
}

filterRange.addEventListener("input", updateFilterValues);
clearBtn.addEventListener("click", resetFilters);
saveBtn.addEventListener("click", saveEditedImage);
imgInput.addEventListener("change", handleImageUpload);
chooseBtn.addEventListener("click", () => imgInput.click());

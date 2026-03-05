document.addEventListener("DOMContentLoaded", function(){

  document.body.style.opacity = "0";

  setTimeout(()=>{
    document.body.style.transition = "opacity 0.5s ease";
    document.body.style.opacity = "1";
  },100);

  const toggle = document.getElementById("menuToggle");
  const menu = document.getElementById("navMenu");
  const overlay = document.getElementById("navOverlay");
  const closeBtn = document.getElementById("closeMenu");

  toggle.addEventListener("click", function(){
    menu.classList.add("active");
    overlay.classList.add("active");
  });

  closeBtn.addEventListener("click", function(){
    menu.classList.remove("active");
    overlay.classList.remove("active");
  });

  overlay.addEventListener("click", function(){
    menu.classList.remove("active");
    overlay.classList.remove("active");
  });

});


let slides = []
let current = 0
let interval
let startX = 0
let isHolding = false

const slider = document.querySelector(".slider")
const slidesContainer = document.getElementById("slides")

fetch("data/rekomendasi.json")
.then(res => res.json())
.then(data => {

  const dotsContainer = document.getElementById("sliderDots")

  data.forEach((item,index)=>{

    const slide = document.createElement("a")
    slide.className="slide"
    slide.href=item.link
    slide.target="_blank"

    const img=document.createElement("img")
    img.src=item.image

    slide.appendChild(img)
    slidesContainer.appendChild(slide)

    const dot=document.createElement("span")

    dot.addEventListener("click",()=>{
      goToSlide(index)
      resetAuto()
    })

    dotsContainer.appendChild(dot)

  })

  // clone slide pertama
  const firstClone = slidesContainer.children[0].cloneNode(true)
  slidesContainer.appendChild(firstClone)

  slides = document.querySelectorAll(".slide")

  updateSlider()
  startAuto()

})

function updateSlider(){

  slidesContainer.style.transform = `translateX(-${current*100}%)`

  document.querySelectorAll(".slider-dots span")
  .forEach(d=>d.classList.remove("active"))

  if(current < slides.length-1){
    document.querySelectorAll(".slider-dots span")[current]
    .classList.add("active")
  }

}

function nextSlide(){

  if(isHolding) return

  current++

  slidesContainer.style.transition="transform .6s ease"
  updateSlider()

  if(current === slides.length-1){

    setTimeout(()=>{

      slidesContainer.style.transition="none"
      current=0
      updateSlider()

    },600)

  }

}

function goToSlide(index){
  current=index
  updateSlider()
}

function startAuto(){
  interval=setInterval(nextSlide,2000)
}

function stopAuto(){
  clearInterval(interval)
}

function resetAuto(){
  stopAuto()
  startAuto()
}


// swipe + hold
slider.addEventListener("touchstart",e=>{
  startX=e.touches[0].clientX
  isHolding=true
  stopAuto()
})

slider.addEventListener("touchend",e=>{

  let endX=e.changedTouches[0].clientX
  isHolding=false

  if(startX-endX>50){
    current++
    if(current>=slides.length){
      current=0
    }
  }

  if(endX-startX>50){
    current--
    if(current<0){
      current=slides.length-1
    }
  }

  updateSlider()
  resetAuto()

})
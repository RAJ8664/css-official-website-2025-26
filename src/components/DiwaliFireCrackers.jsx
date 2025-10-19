import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Observer, CustomEase, CustomWiggle, Physics2DPlugin, ScrollTrigger } from 'gsap/all';

// Register GSAP plugins
gsap.registerPlugin(Observer, CustomEase, CustomWiggle, Physics2DPlugin, ScrollTrigger);

const DiwaliFirecrackers = () => {
  const heroRef = useRef(null);
  const handRef = useRef(null);
  const instructionsRef = useRef(null);
  const rockRef = useRef(null);
  const dragRef = useRef(null);
  const handleRef = useRef(null);
  const canvasRef = useRef(null);
  const proxyRef = useRef(null);
  
  // Diwali-themed images - replace with actual Diwali images
  const diwaliImages = [
    { key: 'diya', src: '/images/diya.png' },
    { key: 'lantern', src: '/images/lantern.png' },
    { key: 'rangoli', src: '/images/rangoli.png' },
    { key: 'sweet', src: '/images/sweet.png' }
  ];

  const explosionImages = [
    { key: 'sparkle1', src: '/images/sparkle1.png' },
    { key: 'sparkle2', src: '/images/sparkle2.png' },
    { key: 'sparkle3', src: '/images/sparkle3.png' },
    { key: 'firework1', src: '/images/firework1.png' }
  ];

  useEffect(() => {
    if (!heroRef.current) return;

    const cannon = new ConfettiCannon(heroRef.current, diwaliImages, explosionImages);
    cannon.init();

    return () => {
      // Cleanup if needed
    };
  }, []);

  return (
    <div 
      ref={heroRef} 
      className="diwali-hero"
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: 'linear-gradient(135deg, #0e100f 0%, #2d1b69 50%, #ff6b35 100%)',
        overflow: 'hidden',
        cursor: 'none'
      }}
    >
      {/* Hidden preload images */}
      <div style={{ display: 'none' }} className="image-preload">
        {diwaliImages.map((img, index) => (
          <img 
            key={index}
            data-key={img.key}
            src={img.src}
            alt=""
            onError={(e) => {
              // Fallback to emoji if image fails to load
              e.target.style.display = 'none';
            }}
          />
        ))}
      </div>

      <div style={{ display: 'none' }} className="explosion-preload">
        {explosionImages.map((img, index) => (
          <img 
            key={index}
            data-key={img.key}
            src={img.src}
            alt=""
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        ))}
      </div>

      {/* Hand cursor */}
      <div 
        ref={handRef}
        className="diwali-hero__hand"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          opacity: 0,
          zIndex: 10,
          fontSize: '24px'
        }}
      >
        ✨
        <small 
          ref={instructionsRef}
          style={{
            position: 'absolute',
            top: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            whiteSpace: 'nowrap',
            color: '#fffce1',
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif'
          }}
        >
          Click and drag to create firecrackers!
        </small>
      </div>

      {/* Rock element */}
      <div 
        ref={rockRef}
        className="diwali-hero__rock"
        style={{
          position: 'absolute',
          bottom: '50px',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '32px',
          opacity: 0
        }}
      >
        🪨
      </div>

      {/* Drag indicator */}
      <div 
        ref={dragRef}
        className="diwali-hero__drag"
        style={{
          position: 'absolute',
          bottom: '20px',
          left: '50%',
          transform: 'translateX(-50%)',
          color: '#fffce1',
          fontFamily: 'Arial, sans-serif',
          fontSize: '14px',
          opacity: 1
        }}
      >
        Drag to create Diwali fireworks!
      </div>

      {/* Handle */}
      <div 
        ref={handleRef}
        className="diwali-hero__handle"
        style={{
          position: 'absolute',
          pointerEvents: 'none',
          opacity: 0
        }}
      >
        {/* Visual handle element */}
      </div>

      {/* SVG Canvas */}
      <svg
        ref={canvasRef}
        className="diwali-hero__canvas"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none'
        }}
      />

      {/* Proxy for touch events */}
      <div 
        ref={proxyRef}
        className="diwali-hero__proxy"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'auto'
        }}
      />

      {/* Diwali decorative elements */}
      <div style={{
        position: 'absolute',
        bottom: '20px',
        width: '100%',
        textAlign: 'center',
        color: '#ffd700',
        fontFamily: 'Arial, sans-serif',
        fontSize: '18px',
        fontWeight: 'bold'
      }}>
        🪔 Happy Diwali! 🪔
      </div>
    </div>
  );
};

class ConfettiCannon {
  constructor(el, diwaliImages, explosionImages) {
    this.el = el;
    this.diwaliImages = diwaliImages;
    this.explosionImages = explosionImages;
  }

  init() {
    const hero = this.el;
    this.hero = hero;

    const el = {
      hand: hero.querySelector(".diwali-hero__hand"),
      instructions: hero.querySelector(".diwali-hero__hand small"),
      rock: hero.querySelector(".diwali-hero__rock"),
      drag: hero.querySelector(".diwali-hero__drag"),
      handle: hero.querySelector(".diwali-hero__handle"),
      canvas: hero.querySelector(".diwali-hero__canvas"),
      proxy: hero.querySelector(".diwali-hero__proxy"),
      preloadImages: hero.querySelectorAll(".image-preload img"),
      xplodePreloadImages: hero.querySelectorAll(".explosion-preload img")
    };
    this.el = el;
    this.isDrawing = false;

    this.imageMap = {};
    this.imageKeys = [];

    this.el.preloadImages.forEach((img) => {
      const key = img.dataset.key;
      this.imageMap[key] = img;
      this.imageKeys.push(key);
    });

    this.explosionMap = {};
    this.explosionKeys = [];

    this.el.xplodePreloadImages.forEach((img) => {
      const key = img.dataset.key;
      this.explosionMap[key] = img;
      this.explosionKeys.push(key);
    });

    this.currentLine = null;
    this.startImage = null;
    this.circle = null;
    this.startX = 0;
    this.startY = 0;
    this.lastDistance = 0;

    this.animationIsOk = window.matchMedia(
      "(prefers-reduced-motion: no-preference)"
    ).matches;

    this.wiggle = CustomWiggle.create("myWiggle", { wiggles: 6 });
    this.clamper = gsap.utils.clamp(1, 100);

    this.xSetter = gsap.quickTo(this.el.hand, "x", { duration: 0.1 });
    this.ySetter = gsap.quickTo(this.el.hand, "y", { duration: 0.1 });

    this.setDiwaliMotion();
    this.initObserver();
    this.initEvents();
  }

  initEvents() {
    if (!this.animationIsOk || ScrollTrigger.isTouch === 1) return;

    this.hero.style.cursor = "none";

    this.hero.addEventListener("mouseenter", (e) => {
      gsap.set(this.el.hand, { opacity: 1 });
      this.xSetter(e.x, e.x);
      this.ySetter(e.y, e.y);
    });

    this.hero.addEventListener("mouseleave", (e) => {
      gsap.set(this.el.hand, { opacity: 0 });
    });

    this.hero.addEventListener("mousemove", (e) => {
      this.xSetter(e.x);
      this.ySetter(e.y);
    });
    
    // Auto fireworks on load
    gsap.delayedCall(1, () => {
      this.createDiwaliExplosion(window.innerWidth/2, window.innerHeight/2, 600);
    });

    // Periodic auto fireworks
    gsap.delayedCall(3, () => {
      this.createRandomFireworks();
    });
  }

  setDiwaliMotion() {
    gsap.set(this.el.hand, { xPercent: -50, yPercent: -50 });
  }

  initObserver() {
    if (!this.animationIsOk) return;

    if (ScrollTrigger.isTouch === 1) {
      Observer.create({
        target: this.el.proxy,
        type: "touch",
        onPress: (e) => {
          this.createDiwaliExplosion(e.x, e.y, 400);
        }
      });
    } else {
      Observer.create({
        target: this.el.proxy,
        type: "pointer",
        onPress: (e) => this.startDrawing(e),
        onDrag: (e) => this.isDrawing && this.updateDrawing(e),
        onDragEnd: (e) => this.clearDrawing(e),
        onRelease: (e) => this.clearDrawing(e)
      });
    }
  }

  startDrawing(e) {
    this.isDrawing = true;
    gsap.set(this.el.instructions, { opacity: 0 });

    this.startX = e.x;
    this.startY = e.y + window.scrollY;

    // Create line
    this.currentLine = document.createElementNS("http://www.w3.org/2000/svg", "line");
    this.currentLine.setAttribute("x1", this.startX);
    this.currentLine.setAttribute("y1", this.startY);
    this.currentLine.setAttribute("x2", this.startX);
    this.currentLine.setAttribute("y2", this.startY);
    this.currentLine.setAttribute("stroke", "#ffd700");
    this.currentLine.setAttribute("stroke-width", "2");
    this.currentLine.setAttribute("stroke-dasharray", "4");

    this.circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    this.circle.setAttribute("cx", this.startX);
    this.circle.setAttribute("cy", this.startY);
    this.circle.setAttribute("r", "30");
    this.circle.setAttribute("fill", "#ff6b35");

    // Create Diwali image at start point
    const randomKey = gsap.utils.random(this.imageKeys);
    const original = this.imageMap[randomKey];
    if (original) {
      const clone = document.createElementNS("http://www.w3.org/2000/svg", "image");
      clone.setAttribute("x", this.startX - 25);
      clone.setAttribute("y", this.startY - 25);
      clone.setAttribute("width", "50");
      clone.setAttribute("height", "50");
      clone.setAttributeNS("http://www.w3.org/1999/xlink", "href", original.src);
      this.startImage = clone;
      this.el.canvas.appendChild(this.startImage);
    }

    this.el.canvas.appendChild(this.currentLine);
    this.el.canvas.appendChild(this.circle);

    gsap.set(this.el.drag, { opacity: 1 });
    gsap.set(this.el.handle, { opacity: 1 });
    gsap.set(this.el.rock, { opacity: 0 });
  }

  updateDrawing(e) {
    if (!this.currentLine || !this.startImage) return;

    let cursorX = e.x;
    let cursorY = e.y + window.scrollY;

    let dx = cursorX - this.startX;
    let dy = cursorY - this.startY;

    let distance = Math.sqrt(dx * dx + dy * dy);
    let shrink = (distance - 30) / distance;

    let x2 = this.startX + dx * shrink;
    let y2 = this.startY + dy * shrink;

    if (distance < 30) {
      x2 = this.startX;
      y2 = this.startY;
    }

    let angle = Math.atan2(dy, dx) * (180 / Math.PI);

    gsap.to(this.currentLine, {
      attr: { x2, y2 },
      duration: 0.1,
      ease: "none"
    });

    let raw = distance / 100;
    let eased = Math.pow(raw, 0.5);
    let clamped = this.clamper(eased);

    gsap.set([this.startImage, this.circle], {
      scale: clamped,
      rotation: `${angle + -45}_short`,
      transformOrigin: "center center"
    });

    gsap.to(this.el.hand, {
      rotation: `${angle + -90}_short`,
      duration: 0.1,
      ease: "none"
    });

    this.lastDistance = distance;
  }

  createDiwaliExplosion(x, y, distance = 100) {
    const count = Math.round(gsap.utils.clamp(5, 150, distance / 15));
    const explosion = gsap.timeline();
    const speed = gsap.utils.mapRange(0, 500, 0.3, 1.5, distance);
    const sizeRange = gsap.utils.mapRange(0, 500, 15, 80, distance);

    // Diwali colors
    const diwaliColors = ['#ffd700', '#ff6b35', '#ff0000', '#00ff00', '#ffffff', '#ffa500'];
    
    for (let i = 0; i < count; i++) {
      const randomKey = gsap.utils.random(this.explosionKeys);
      const original = this.explosionMap[randomKey];
      const img = original ? original.cloneNode(true) : this.createFallbackSparkle();

      img.className = "explosion-img";
      img.style.position = "absolute";
      img.style.pointerEvents = "none";
      img.style.height = `${gsap.utils.random(15, sizeRange)}px`;
      img.style.left = `${x}px`;
      img.style.top = `${y}px`;
      img.style.zIndex = 4;
      img.style.filter = `hue-rotate(${gsap.utils.random(0, 360)}deg)`;

      this.hero.appendChild(img);

      const angle = Math.random() * Math.PI * 2;
      const velocity = gsap.utils.random(500, 2000) * speed;

      explosion
        .to(
          img,
          {
            physics2D: {
              angle: angle * (180 / Math.PI),
              velocity: velocity,
              gravity: 2500
            },
            rotation: gsap.utils.random(-360, 360),
            duration: 1.5 + Math.random()
          },
          0
        )
        .to(
          img,
          {
            opacity: 0,
            duration: 0.3,
            ease: "power2.out",
            onComplete: () => img.remove()
          },
          1.2
        );
    }

    return explosion;
  }

  createFallbackSparkle() {
    const div = document.createElement('div');
    div.innerHTML = '✨';
    div.style.fontSize = '24px';
    div.style.color = gsap.utils.random(['#ffd700', '#ff6b35', '#ff0000', '#00ff00']);
    return div;
  }

  createRandomFireworks() {
    if (this.isDrawing) return;
    
    const x = gsap.utils.random(100, window.innerWidth - 100);
    const y = gsap.utils.random(100, window.innerHeight - 100);
    const size = gsap.utils.random(300, 800);
    
    this.createDiwaliExplosion(x, y, size);
    
    // Schedule next random firework
    gsap.delayedCall(gsap.utils.random(1, 3), () => this.createRandomFireworks());
  }

  clearDrawing(e) {
    if (!this.isDrawing) return;
    this.createDiwaliExplosion(this.startX, this.startY, this.lastDistance);

    gsap.set(this.el.drag, { opacity: 0 });
    gsap.set(this.el.handle, { opacity: 0 });
    gsap.set(this.el.rock, { opacity: 1 });

    gsap.to(this.el.rock, {
      duration: 0.4,
      rotation: "+=30",
      ease: "myWiggle",
      onComplete: () => {
        gsap.set(this.el.rock, { opacity: 0 });
        gsap.set(this.el.hand, { rotation: 0, overwrite: "auto" });
        gsap.to(this.el.instructions, { opacity: 1 });
        gsap.set(this.el.drag, { opacity: 1 });
      }
    });

    this.isDrawing = false;
    this.el.canvas.innerHTML = "";
    this.currentLine = null;
    this.startImage = null;
  }
}

export default DiwaliFirecrackers;
console.log("✅ script loaded");
const canvas = document.getElementById("trail");
const ctx = canvas.getContext("2d");
const crayon = document.getElementById("crayon");

const trail = []; // 存放蜡笔轨迹点

document.addEventListener("mousemove", (e) => {
  const x = e.clientX;
  const y = e.clientY;

  // 记录每次移动的点
  trail.push({
    x,
    y,
    lastX: mouseX,
    lastY: mouseY,
    alpha: 1.0, // 线条初始不透明
  });

  mouseX = x;
  mouseY = y;

  crayon.style.left = x + "px";
  crayon.style.top = y + "px";
});


let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

let mouseX = 0, mouseY = 0;
let lastX = 0, lastY = 0;
let isMoving = false;

// 更新画布尺寸（防止缩放）
window.addEventListener("resize", () => {
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width;
  canvas.height = height;
});

document.addEventListener("mousemove", (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  isMoving = true;
  crayon.style.left = mouseX + "px";
  crayon.style.top = mouseY + "px";
});


drawTrail();
function drawTrail() {
  // 在白色背景上绘制红线
  ctx.clearRect(0, 0, width, height); // 每帧先清空整个画布

  // 绘制现有的拖尾
  for (let i = 0; i < trail.length; i++) {
    const t = trail[i];
    ctx.beginPath();
    ctx.moveTo(t.lastX, t.lastY);
    ctx.lineTo(t.x, t.y);
    ctx.strokeStyle = `rgba(220, 20, 60, ${t.alpha})`; // 红色线条透明度变化
    ctx.lineWidth = 3;
    ctx.lineCap = "round";
    ctx.stroke();

    // 每帧透明度递减（形成淡出）
    t.alpha -= 0.03;
  }

  // 移除已经完全消失的线条
  for (let i = trail.length - 1; i >= 0; i--) {
    if (trail[i].alpha <= 0) trail.splice(i, 1);
  }

  requestAnimationFrame(drawTrail);
}
const texts = document.querySelectorAll(".text");
const preview = document.getElementById("preview");
const videoContainer = document.querySelector(".video-container"); // ✅ 控制视频显示隐藏
const poem = document.querySelector(".poem"); // ✅ 控制诗文字显示隐藏


let currentIndex = 0;
let interval = null;

texts.forEach(item => {
  const imgs = item.getAttribute("data-images").split(",");
  let currentIndex = 0;
  let interval;

  item.addEventListener("mouseenter", () => {

  // ✅ 先定义再用（要放在最上面）
  const rightCities = ["t1", "t3", "t5"]; // newyork, tokyo, other
  const leftCities = ["t2", "t4", "t6"];  // beijing, dali, xinjiang

  // 然后再用它们来控制左右位置
  if (rightCities.some(cls => item.classList.contains(cls))) {
    preview.parentElement.classList.remove("left");
    poem.classList.remove("left-align");
    poem.classList.add("right-align");
  } else if (leftCities.some(cls => item.classList.contains(cls))) {
    preview.parentElement.classList.add("left");
    poem.classList.remove("right-align");
    poem.classList.add("left-align");
  }

  // ✅ 更新诗的文字内容
  const poems = {
    t1: "the MET <br>",
    t2: "beijing <br>",
    t3: "tokyo <br>",
    t4: "dali <br>",
    t5: "ocean <br>",
    t6: "xinjiang <br>"
  };
  poem.innerHTML = poems[item.classList[1]] || "";

  // ✅ 显示第一张图
  if (imgs.length > 0) {
    preview.src = imgs[currentIndex];
    preview.style.opacity = 1;
    videoContainer.classList.add("hidden");
    poem.classList.add("visible");

    // 自动播放
    interval = setInterval(() => {
      currentIndex = (currentIndex + 1) % imgs.length;
      preview.src = imgs[currentIndex];
    }, 1500);
  }
});

  item.addEventListener("mouseleave", () => {
    clearInterval(interval);       // 停止轮播
    preview.style.opacity = 0;     // 淡出图片
    videoContainer.classList.remove("hidden"); // ✅ 视频重新出现
    poem.classList.remove("visible");          // ✅ 文字消失

  });
});




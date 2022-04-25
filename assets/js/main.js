// Một số bài hát có thể bị lỗi do liên kết bị hỏng. Vui lòng thay thế liên kết khác để có thể phát
// Some songs may be faulty due to broken links. Please replace another link so that it can be played

const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const PlAYER_STORAGE_KEY = "F8_PLAYER";

const player = $(".player");
const cd = $(".cd");
const heading = $("header h2");
const cdThumb = $(".cd-thumb");
const audio = $("#audio");
const playBtn = $(".btn-toggle-play");
const progress = $("#progress");
const prevBtn = $(".btn-prev");
const nextBtn = $(".btn-next");
const randomBtn = $(".btn-random");
const repeatBtn = $(".btn-repeat");
const playlist = $(".playlist");
const currentTime = $('.current-time')
const dutationTime = $('.duration-time')

const app = {
  currentIndex: 0,
  isPlaying: false,
  isRandom: false,
  isRepeat: false,
  config: {},
  // (1/2) Uncomment the line below to use localStorage
  config: JSON.parse(localStorage.getItem(PlAYER_STORAGE_KEY)) || {},
  songs: [
    {
      name: "Doraemon",
      singer: "大杉久美子",
      path: "./assets/music/Doraemon.mp3",
      image: "./assets/img/doraemon.jpg"
    },
    {
      name: "Lemon",
      singer: "米津玄師",
      path: "./assets/music/Lemon.mp3",
      image: "./assets/img/lemon.jpg"
    },
    {
      name: "Way Back Home",
      singer: "SHAUN (숀)",
      path: "./assets/music/Way_back_home.mp3",
      image: "./assets/img/way_back_home.jpg"
    },
    {
      name: "Haru Haru",
      singer: "BIGBANG",
      path: "./assets/music/Haru_Haru.mp3",
      image: "./assets/img/haruharu.jpg"
    },
    {
      name: "Just Give Me A Reason",
      singer: "Pink ft. Nate Ruess",
      path: "./assets/music/Just_Give_Me_A_Reason.mp3",
      image: "./assets/img/just_give_me_a_reason.jpg"
    },
    {
      name: "Try",
      singer: "Pink",
      path: "./assets/music/Try.mp3",
      image: "./assets/img/try.jpg"
    },
    {
      name: "Every Time",
      singer: "CHEN(첸)XPunch(펀치)",
      path: "./assets/music/Everytime.mp3",
      image: "./assets/img/every_time.jpg"
    },
    {
      name: "追光者 (Người Theo Đuổi Ánh Sáng)",
      singer: "岑寧兒",
      path: "./assets/music/ntda_sang.mp3",
      image: "./assets/img/ng_theo_duoi_anh_sang.jpg"
    },
    {
      name: "不仅仅是喜欢 (Không Chỉ Là Thích)",
      singer: "萧全",
      path: "./assets/music/kcl_thich.mp3",
      image: "./assets/img/khong_chi_la_thich.jpg"
    },
    {
      name: "あとひとつ",
      singer: "Covered by コバソロ & こぴ",
      path: "./assets/music/atohitotsu.mp3",
      image: "./assets/img/atohitotsu.jpg"
    },
    {
      name: "On My Way",
      singer: "Alan Walker",
      path: "./assets/music/onmyway.mp3",
      image: "./assets/img/onmyway.jpg"
    },
    {
      name: "Ngẫu Hứng",
      singer: "HOAPROX",
      path: "./assets/music/ngauhung.mp3",
      image: "./assets/img/ngauhung.jpg"
    },
  ],
  setConfig: function (key, value) {
    this.config[key] = value;
    // (2/2) Uncomment the line below to use localStorage
    localStorage.setItem(PlAYER_STORAGE_KEY, JSON.stringify(this.config));
  },
  render: function () {
    const htmls = this.songs.map((song, index) => {
      return `
                        <div class="song ${
                          index === this.currentIndex ? "active" : ""
                        }" data-index="${index}">
                            <div class="thumb"
                                style="background-image: url('${song.image}')">
                            </div>
                            <div class="body">
                                <h3 class="title">${song.name}</h3>
                                <p class="author">${song.singer}</p>
                            </div>
                            <div class="option">
                                <i class="fas fa-ellipsis-h"></i>
                            </div>
                        </div>
                    `;
    });
    playlist.innerHTML = htmls.join("");
  },
  defineProperties: function () {
    Object.defineProperty(this, "currentSong", {
      get: function () {
        return this.songs[this.currentIndex];
      }
    });
  },
  handleEvents: function () {
    const _this = this;
    const cdWidth = cd.offsetWidth;

    // Xử lý CD quay / dừng
    // Handle CD spins / stops
    const cdThumbAnimate = cdThumb.animate([{ transform: "rotate(360deg)" }], {
      duration: 10000, // 10 seconds
      iterations: Infinity
    });
    cdThumbAnimate.pause();

    // Xử lý phóng to / thu nhỏ CD
    // Handles CD enlargement / reduction
    document.onscroll = function () {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const newCdWidth = cdWidth - scrollTop;

      cd.style.width = newCdWidth > 0 ? newCdWidth + "px" : 0;
      cd.style.opacity = newCdWidth / cdWidth;
    };

    // Xử lý khi click play
    // Handle when click play
    playBtn.onclick = function () {
      if (_this.isPlaying) {
        audio.pause();
      } else {
        audio.play();
      }
    };

    // Khi song được play
    // When the song is played
    audio.onplay = function () {
      _this.isPlaying = true;
      player.classList.add("playing");
      cdThumbAnimate.play();
    };

    // Khi song bị pause
    // When the song is pause
    audio.onpause = function () {
      _this.isPlaying = false;
      player.classList.remove("playing");
      cdThumbAnimate.pause();
    };

    // Khi tiến độ bài hát thay đổi
    // When the song progress changes
    audio.ontimeupdate = function () {
      if (audio.duration) {
        const progressPercent = Math.floor((audio.currentTime / audio.duration) * 100);
        progress.value = progressPercent;

        // Thay đổi time hiệp tại
        var targetCurrentTime = Math.floor(audio.currentTime); //thời gian hiện tại bài hát đang chạy
        var minute = Math.floor(targetCurrentTime/60); // số phút
        var second = targetCurrentTime % 60;
        if (second < 10){
          second = '0' + second;
        }
        currentTime.textContent = '0' + minute + ':' + second

        // hiển thị tổng thời gian song
        var targetDurationTime = Math.floor(audio.duration); //thời gian hiện tại bài hát đang chạy
        var minute1 = Math.floor(targetDurationTime/60); // số phút
        var second1 = targetDurationTime % 60;
        if (second1 < 10){
          second1 = '0' + second1;
        }else{
          second1 = ''+ second1
        }
        dutationTime.textContent = '0' + minute1 + ':' + second1;
      }
    };

    // Xử lý khi tua song
    // Handling when seek
    progress.oninput = function (e) {
      const seekTime = (audio.duration / 100) * e.target.value;
      audio.currentTime = seekTime;
    };

    // Khi next song
    // When next song
    nextBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.nextSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Khi prev song
    // When prev song
    prevBtn.onclick = function () {
      if (_this.isRandom) {
        _this.playRandomSong();
      } else {
        _this.prevSong();
      }
      audio.play();
      _this.render();
      _this.scrollToActiveSong();
    };

    // Xử lý bật / tắt random song
    // Handling on / off random song
    randomBtn.onclick = function (e) {
      _this.isRandom = !_this.isRandom;
      _this.setConfig("isRandom", _this.isRandom);
      randomBtn.classList.toggle("active", _this.isRandom);
    };

    // Xử lý lặp lại một song
    // Single-parallel repeat processing
    repeatBtn.onclick = function (e) {
      _this.isRepeat = !_this.isRepeat;
      _this.setConfig("isRepeat", _this.isRepeat);
      repeatBtn.classList.toggle("active", _this.isRepeat);
    };

    // Xử lý next song khi audio ended
    // Handle next song when audio ended
    audio.onended = function () {
      if (_this.isRepeat) {
        audio.play();
      } else {
        nextBtn.click();
      }
    };

    // Lắng nghe hành vi click vào playlist
    // Listen to playlist clicks
    playlist.onclick = function (e) {
      const songNode = e.target.closest(".song:not(.active)");

      if (songNode || e.target.closest(".option")) {
        // Xử lý khi click vào song
        // Handle when clicking on the song
        if (songNode) {
          _this.currentIndex = Number(songNode.dataset.index);
          _this.loadCurrentSong();
          _this.render();
          audio.play();
        }

        // Xử lý khi click vào song option
        // Handle when clicking on the song option
        if (e.target.closest(".option")) {
        }
      }
    };
  },
  scrollToActiveSong: function () {
    if (this.currentIndex === 0) {
      document.documentElement.scrollTop = 0
    };
    setTimeout(() => {
      $(".song.active").scrollIntoView({
        behavior: "smooth",
        block: "nearest"
      });
    }, 100);
  },
  loadCurrentSong: function () {
    heading.textContent = this.currentSong.name;
    cdThumb.style.backgroundImage = `url('${this.currentSong.image}')`;
    audio.src = this.currentSong.path;
  },
  loadConfig: function () {
    this.isRandom = this.config.isRandom;
    this.isRepeat = this.config.isRepeat;
  },
  nextSong: function () {
    this.currentIndex++;
    if (this.currentIndex >= this.songs.length) {
      this.currentIndex = 0;
    }
    this.loadCurrentSong();
  },
  prevSong: function () {
    this.currentIndex--;
    if (this.currentIndex < 0) {
      this.currentIndex = this.songs.length - 1;
    }
    this.loadCurrentSong();
  },
  playRandomSong: function () {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * this.songs.length);
    } while (newIndex === this.currentIndex && newIndex < this.songs.length);

    this.currentIndex = newIndex;
    this.loadCurrentSong();
  },
  start: function () {
    // Gán cấu hình từ config vào ứng dụng
    // Assign configuration from config to application
    this.loadConfig();

    // Định nghĩa các thuộc tính cho object
    // Defines properties for the object
    this.defineProperties();

    // Lắng nghe / xử lý các sự kiện (DOM events)
    // Listening / handling events (DOM events)
    this.handleEvents();

    // Tải thông tin bài hát đầu tiên vào UI khi chạy ứng dụng
    // Load the first song information into the UI when running the app
    this.loadCurrentSong();

    // Render playlist
    this.render();

    // Hiển thị trạng thái ban đầu của button repeat & random
    // Display the initial state of the repeat & random button
    randomBtn.classList.toggle("active", this.isRandom);
    repeatBtn.classList.toggle("active", this.isRepeat);
  }
};

app.start();

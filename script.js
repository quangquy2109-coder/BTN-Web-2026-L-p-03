document.addEventListener("DOMContentLoaded", () => {
  /* Xử lý Lọc bài tin theo Tab (Mới / Sự Kiện / Thông Báo / Nhân Vật) */
  const tabBtns = document.querySelectorAll(".tab-btn");

  tabBtns.forEach((tab) => {
    tab.addEventListener("click", function () {
      tabBtns.forEach((t) => t.classList.remove("active"));
      this.classList.add("active");

      const category = this.getAttribute("data-category");

      newsItems.forEach((item) => {
        const itemTag = item.getAttribute("data-tag");
        if (category === "all" || itemTag === category) {
          item.style.display = "block";
        } else {
          item.style.display = "none";
        }
      });

      // Tự động bấm chọn bài tin đầu tiên thuộc danh mục đó để đổi ảnh ngay lập tức
      const firstVisible = Array.from(newsItems).find(
        (i) => i.style.display !== "none",
      );
      if (firstVisible) firstVisible.click();
    });
  });
  /* ==========================================================================
       1. XỬ LÝ TÍNH NĂNG CHUYỂN ĐỔI TIN TỨC (NEWS SELECTOR)
       ========================================================================== */
  const newsItems = document.querySelectorAll(".news-item");
  const featuredImg = document.getElementById("featured-img");
  const featuredTag = document.getElementById("featured-tag");
  const featuredDate = document.getElementById("featured-date");
  const featuredTitle = document.getElementById("featured-title");
  const featuredDesc = document.getElementById("featured-desc");

  if (newsItems.length > 0) {
    newsItems.forEach((item) => {
      item.addEventListener("click", function () {
        // Xóa lớp active khỏi tất cả các item tin tức
        newsItems.forEach((i) => i.classList.remove("active"));

        // Thêm lớp active cho item vừa được click
        this.classList.add("active");

        // Lấy dữ liệu từ thuộc tính data-* của thẻ được click
        const imgUrl = this.getAttribute("data-img");
        const tagText = this.getAttribute("data-tag");
        const dateText = this.getAttribute("data-date");
        const titleText = this.getAttribute("data-title");
        const descText = this.getAttribute("data-desc");

        // Cập nhật nội dung cho khung Tin Nổi Bật bên trái
        if (featuredImg) featuredImg.src = imgUrl;
        if (featuredTag) featuredTag.innerText = tagText;
        if (featuredDate) featuredDate.innerText = dateText;
        if (featuredTitle) featuredTitle.innerText = titleText;
        if (featuredDesc) featuredDesc.innerText = descText;
      });
    });
  }

  /* ==========================================================================
       2. XỬ LÝ TRÌNH PHÁT NHẠC CỐ ĐỊNH & XOAY ĐĨA NHẠC
       ========================================================================== */
  /* ==========================================================================
       2. XỬ LÝ TRÌNH PHÁT NHẠC CỐ ĐỊNH & PLAYLIST MENU
       ========================================================================== */
  const bgMusic = document.getElementById("bgMusic");
  const playPauseBtn = document.getElementById("playPauseBtn");
  const playerIcon = document.querySelector(".player-icon");
  const trackTitle = document.querySelector(".track-title");
  const trackArtist = document.querySelector(".track-artist");

  // Thẻ liên quan đến Dropdown Menu
  const musicMenuBtn = document.getElementById("musicMenuBtn");
  const musicDropdown = document.getElementById("musicDropdown");
  const playlistItems = document.querySelectorAll(".playlist-item");

  if (bgMusic) {
    let isPlaying = false;

    // 1. Hàm bật / tắt nhạc
    function toggleMusic() {
      if (isPlaying) {
        bgMusic.pause();
        if (playPauseBtn)
          playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        if (playerIcon) playerIcon.classList.remove("playing");
        isPlaying = false;
      } else {
        bgMusic
          .play()
          .then(() => {
            if (playPauseBtn)
              playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            if (playerIcon) playerIcon.classList.add("playing");
            isPlaying = true;
          })
          .catch((error) => {
            console.log("Trình duyệt chặn phát nhạc:", error);
            alert("Vui lòng tương tác với trang web để phát nhạc!");
          });
      }
    }

    // 2. Click nút Play/Pause dưới góc
    if (playPauseBtn) {
      playPauseBtn.addEventListener("click", toggleMusic);
    }

    // 3. Click nút Music trên Navigation để Bật/Tắt bảng chọn bài
    if (musicMenuBtn && musicDropdown) {
      musicMenuBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        musicDropdown.classList.toggle("show");
      });

      // Tự đóng menu khi nhấp chuột ra ngoài
      document.addEventListener("click", (e) => {
        if (
          !musicDropdown.contains(e.target) &&
          !musicMenuBtn.contains(e.target)
        ) {
          musicDropdown.classList.remove("show");
        }
      });
    }

    // 4. Click chọn một bài hát từ Danh Sách
    playlistItems.forEach((item) => {
      item.addEventListener("click", function () {
        // Xóa active khỏi tất cả các bài
        playlistItems.forEach((i) => i.classList.remove("active"));
        this.classList.add("active");

        // Lấy thông tin bài hát vừa chọn
        const newSrc = this.getAttribute("data-src");
        const newTitle = this.getAttribute("data-title");
        const newArtist = this.getAttribute("data-artist");

        // Đổi bài hát và cập nhật thông tin lên Trình phát dưới góc
        bgMusic.src = newSrc;
        if (trackTitle) trackTitle.innerText = newTitle;
        if (trackArtist) trackArtist.innerText = newArtist;

        // Tự động phát bài hát vừa chọn
        isPlaying = false; // Reset lại trạng thái
        toggleMusic();

        // Đóng danh sách sau khi chọn xong
        if (musicDropdown) musicDropdown.classList.remove("show");
      });
    });

    // 5. Tự động chuyển bài tiếp theo khi bài hát kết thúc
    bgMusic.addEventListener("ended", () => {
      let currentActive = document.querySelector(".playlist-item.active");
      let nextItem = currentActive ? currentActive.nextElementSibling : null;

      // Nếu là bài cuối cùng thì quay lại bài đầu tiên
      if (!nextItem) {
        nextItem = playlistItems[0];
      }

      if (nextItem) nextItem.click();
    });
  }

  /* ==========================================================================
       3. XỬ LÝ SAO CHÉP MÃ QUÀ (COPY GIFTCODE)
       ========================================================================== */
  const copyButtons = document.querySelectorAll(".btn-copy");

  copyButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      // Tìm mã quà nằm cùng thẻ cha .code-card
      const codeCard = this.closest(".code-card");
      const codeText = codeCard.querySelector(".code-text").innerText;

      // Sao chép vào khay nhớ tạm Clipboard
      navigator.clipboard
        .writeText(codeText)
        .then(() => {
          const originalText = this.innerText;

          // Phản hồi trực quan trên nút
          this.innerText = "Đã Chép!";
          this.style.background = "#4cc2f8";
          this.style.color = "#fff";

          // Trả lại trạng thái ban đầu sau 2 giây
          setTimeout(() => {
            this.innerText = originalText;
            this.style.background = "var(--accent-gold)";
            this.style.color = "#000";
          }, 2000);
        })
        .catch((err) => {
          console.error("Lỗi khi sao chép mã:", err);
        });
    });
  });

  /* ==========================================================================
       4. TƯƠNG TÁC THẺ QUỐC GIA (NATION CARDS CLICK)
       ========================================================================== */
  const nationCards = document.querySelectorAll(".nation-card");

  nationCards.forEach((card) => {
    card.addEventListener("click", function () {
      const nationName = this.querySelector("h3").innerText;
      /* 📌 [HƯỚNG DẪN SINH VIÊN]: 
               Bạn có thể mở rộng tính năng này để chuyển hướng sang trang chi tiết 
               hoặc hiển thị Modal thông tin nhân vật của quốc gia đó. */
      alert(`Bạn vừa chọn khám phá quốc gia: ${nationName}!`);
    });
  });
});

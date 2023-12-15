
      document.addEventListener("DOMContentLoaded", function () {
        const searchInput = document.getElementById("searchInput");
        const postListContainer = document.getElementById("postList");
        let posts;

        function fetchData() {
          fetch("https://jsonplaceholder.typicode.com/posts")
          .then((response) => response.json())
          .then((data) => {
              posts = data; 
              renderPosts(posts);
          });
        }

        function renderPosts(posts) {
          postListContainer.innerHTML = "";

          // Loader ekleniyor
          const loader = document.createElement("div");
          loader.className = "loader";
          postListContainer.appendChild(loader);

          // Postlar asenkron olarak yükleniyor
          setTimeout(() => {
            // Loader kaldırılıyor
            postListContainer.removeChild(loader);

            posts.forEach((post) => {
              const postCard = document.createElement("div");
              postCard.className = "post-card";
              postCard.innerHTML = `
                            <h2>${post.title}</h2>
                            <p>${post.body}</p>
                            <button class="delete-btn">Delete</button>
                        `;
              postCard.addEventListener("click", () => showComments(post.id));

              // deletePost fonksiyonu bu şekilde event listener olarak atanıyor
              postCard
                .querySelector(".delete-btn")
                .addEventListener("click", (event) =>
                  deletePost(post.id, event)
                );

              postListContainer.appendChild(postCard);
            });
          }, 1000);
        }

        function deletePost(postId, event) {
          event.stopPropagation(); // Bu satır, click event'inin post card'a iletilmesini engeller

          // Delete modalı oluşturuluyor
          const deleteModal = document.createElement("div");
          deleteModal.className = "modal";
          deleteModal.innerHTML = `
        <div class="delete-modal" >
            <p>Are you sure you want to delete this post ?</p>
            <div class= "button-bar">
            <button id="confirmDeleteBtn" >Delete</button>
            <button id="cancelDeleteBtn">Cancel</button></div>
        </div>
    `;
          deleteModal.style.display = "flex";

          document.body.appendChild(deleteModal);

          // Confirm ve Cancel butonlarına event listener ekleniyor
          const confirmDeleteBtn = document.getElementById("confirmDeleteBtn");
          const cancelDeleteBtn = document.getElementById("cancelDeleteBtn");

          confirmDeleteBtn.addEventListener("click", () => {
           
            posts = posts.filter((post) => post.id !== postId);
            

            // Modal kaldırılıyor
            deleteModal.remove();

            // Render işlemini gerçekleştir
            renderPosts(posts);
          });

          cancelDeleteBtn.addEventListener("click", () => {
            // Kullanıcı Cancel'e tıkladığında modal kaldırılıyor
            deleteModal.remove();
          });
        }
        function showComments(postId) {
            // Modalı açmadan önce loader'ı ekleyin
            const commentModal = document.getElementById("commentModal");
            const commentModalContent = document.getElementById("commentModalContent");
            commentModalContent.innerHTML = '<div class="loader"></div>';
            commentModal.style.display = "flex";
          
            // Fetch işlemi
            fetch(`https://jsonplaceholder.typicode.com/posts/${postId}/comments`)
              .then((response) => response.json())
              .then((comments) => {
                // Veriler geldiğinde loader'ı kaldır ve modal içeriği oluştur
                commentModalContent.innerHTML = `
                <div class="comment-modal">
                  <div class="modal-header">
                    <h2 class="modal-title">Comments</h2>
                    <button id="closeCommentModalBtn" class="close-btn">&#10006;</button>
                  </div>
                  <ul class="comment-list">
                    ${comments
                      .map(
                        (comment) => `
                          <li class="comment-item">
                            <strong class="comment-author">${comment.name}</strong>: ${comment.body}
                          </li>`
                      )
                      .join("")}
                  </ul>
                </div>
              `;
              
          
                // Close buttona event listener ekleme
                const closeCommentModalBtn = document.getElementById("closeCommentModalBtn");
                closeCommentModalBtn.addEventListener("click", closeCommentModal);
              })
              .catch((error) => {
                // Hata durumunda loader'ı kaldır ve hata mesajını göster
                commentModalContent.innerHTML = `<p style="color: red;">Error: ${error.message}</p> 
                <button id="closeCommentModalBtn" class="close-btn">&#10006;</button>`;
              });
          }
          
          
        function closeCommentModal() {
            const commentModal = document.getElementById("commentModal");
            commentModal.style.display = "none";
          }

          

        
        searchInput.addEventListener(
          "input",
          debounce(() => {
            const searchTerm = searchInput.value.toLowerCase();
            fetch("https://jsonplaceholder.typicode.com/posts")
              .then((response) => response.json())
              .then((posts) => {
                const filteredPosts = posts.filter(
                  (post) =>
                    post.title.toLowerCase().includes(searchTerm) ||
                    post.body.toLowerCase().includes(searchTerm)
                );


                // Eğer arama sonucu boşsa, tüm postları göster
                if (filteredPosts.length === 0 && searchTerm.trim() !== "") {
                  renderPosts(posts);
                } else {
                  posts = filteredPosts;
                  renderPosts(filteredPosts);
                }
              });
          }, 300)
        );

        fetchData();

        function debounce(func, wait) {
          let timeout;
          return function executedFunction(...args) {
            const later = () => {
              clearTimeout(timeout);
              func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
          };
        }
      });

      const searchInput = document.getElementById("searchInput");

      searchInput.addEventListener("input", function () {
        const clearIcon = document.getElementById("clearIcon");
    
        if (searchInput.value.trim() !== "") {
          // Input değeri dolu ise çarpı simgesini göster
          clearIcon.style.display = "block";
        } else {
          // Input değeri boş ise çarpı simgesini gizle
          clearIcon.style.display = "none";
        }
      });
    
      searchInput.addEventListener("focus", function () {
        const clearIcon = document.getElementById("clearIcon");
    
        if (searchInput.value.trim() !== "") {
          // Input odaklandığında ve değer dolu ise çarpı simgesini göster
          clearIcon.style.display = "block";
        }
      });
    
      // Çarpı simgesine tıklanınca input değerini temizle
      document.getElementById("clearIcon").addEventListener("click", function () {
        searchInput.value = "";
        this.style.display = "none";
      });
    

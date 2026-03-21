<template>
  <div class="hero-bg min-h-screen flex flex-col items-center justify-center py-8">
    <div class="bg-white rounded-3xl shadow-2xl p-8 flex flex-col items-center w-full max-w-md card">
      <div class="mb-4">
        <img
          class="avatar w-28 h-28 rounded-full border-4 border-lime-200 shadow-lg"
          src="https://cdn.jsdelivr.net/gh/yasaitoriovo/toriest-img@latest/me/icon.jpeg"
          alt="Profile"
        >
      </div>
      <h1 class="text-3xl font-bold text-green-500 mb-2">
        Yasaitori
      </h1>
      <p class="text-gray-600 mb-6 text-center">
        Always be brave to <del>sleep</del> <span class="font-bold">Dream.</span>
      </p>

      <!-- Social Media Buttons -->
      <div class="flex space-x-4">
        <a
          class="btn bg-black text-white btn-square"
          href="https://github.com/yasaitoriovo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            aria-label="GitHub logo"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          ><path
            fill="white"
            d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z"
          /></svg>
        </a>
        
        <a
          class="btn text-black bg-white btn-square"
          href="https://blog.yatori.cc"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="16"
            viewBox="0 -960 960 960"
            width="16"
            fill="black"
          >
            <path
              d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h440l200 200v440q0 33-23.5 56.5T760-120H200Zm0-80h560v-400H600v-160H200v560Zm80-80h400v-80H280v80Zm0-320h200v-80H280v80Zm0 160h400v-80H280v80Zm-80-320v160-160 560-560Z"</path>
          </svg>
        </a>

        <a
          class="btn bg-white text-black btn-square"
          href="mailto:me@yatori.cc"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            aria-label="Email icon"
            width="16"
            height="16"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
          ><g
            stroke-linejoin="round"
            stroke-linecap="round"
            stroke-width="2"
            fill="none"
            stroke="black"
          ><rect
            width="20"
            height="16"
            x="2"
            y="4"
            rx="2"
          /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></g></svg>
        </a>

        <a
          class="btn text-white bg-black btn-square"
          href="https://x.com/yasaitoriovo"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg
            aria-label="X logo"
            width="16"
            height="12"
            viewBox="0 0 300 271"
            xmlns="http://www.w3.org/2000/svg"
          ><path
            fill="currentColor"
            d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z"
          /></svg>
        </a>
      </div>
    </div>
  </div>
</template>

<style scoped>
  a {
    transition: transform 0.3s ease-in-out;
  }

  a:hover {
    transform: scale(1.1);
  }

  .card {
    transition: 
      transform 0.3s ease,
      box-shadow 0.3s ease;
  }

  .card:hover {
    transform: scale(1.02);
    box-shadow: 0 20px 40px rgba(0,0,0,0.15);
  }

  .avatar {
    position: relative;
    width: 100px;
    height: 100px;
    border-radius: 50%;
    animation: breathe 3s ease-in-out infinite;
  }

  .avatar::after {
    content: "";
    position: absolute;
    inset: -10px;
    border-radius: 50%;
    background: radial-gradient(
      circle,
      rgba(120,255,120,0.4),
      transparent 70%
    );
    animation: breathe 3s infinite;
  }

  @keyframes breathe {
    0% {
      box-shadow: 0 0 5px rgba(120, 255, 120, 0.3);
    }
    50% {
      box-shadow: 0 0 25px rgba(120, 255, 120, 0.7);
    }
    100% {
      box-shadow: 0 0 5px rgba(120, 255, 120, 0.3);
    }
  }
</style>

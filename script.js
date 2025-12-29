document.addEventListener("DOMContentLoaded", () => {
  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute("href"));
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    });
  });

  // --- Fetch Latest Release and Stars from GitHub ---
  const macOSRepo = "floatpane/floatpane";
  const windowsRepo = "floatpane/floatpane-windows";
  const versionSpan = document.getElementById("latest-version");
  const demoVersionSpan = document.getElementById("demo-version");
  const downloadLink = document.getElementById("download-link");
  const installLink = document.getElementById("install-link");
  const windowsInstallLink = document.getElementById("windows-install-link");
  const starsSpan = document.getElementById("github-stars");

  async function fetchRepoInfo() {
    try {
      // Fetch macOS release info
      const macOSReleaseResponse = await fetch(
        `https://api.github.com/repos/floatpane/floatpane/releases/latest`,
      );
      if (macOSReleaseResponse.ok) {
        const releaseData = await macOSReleaseResponse.json();
        const latestVersion = releaseData.tag_name;
        const releaseUrl = releaseData.html_url;
        if (demoVersionSpan) demoVersionSpan.textContent = latestVersion;
        if (versionSpan) versionSpan.textContent = latestVersion;

        if (downloadLink) downloadLink.href = releaseUrl;
        if (installLink) installLink.href = releaseUrl;
      }

      // Fetch Windows release info
      try {
        const windowsReleaseResponse = await fetch(
          `https://api.github.com/repos/${windowsRepo}/releases/latest`,
        );
        if (windowsReleaseResponse.ok && windowsInstallLink) {
          const windowsReleaseData = await windowsReleaseResponse.json();
          windowsInstallLink.href = windowsReleaseData.html_url;
        }
      } catch (error) {
        console.log("Windows repo not found or accessible:", error);
      }

      // Fetch repo info for stars (using macOS repo)
      const repoResponse = await fetch(
        `https://api.github.com/repos/${macOSRepo}`,
      );
      if (repoResponse.ok) {
        const repoData = await repoResponse.json();
        const starCount = repoData.stargazers_count;

        if (starsSpan) starsSpan.textContent = starCount;
      }
    } catch (error) {
      console.error("Could not fetch GitHub data:", error);
      if (versionSpan) versionSpan.textContent = "N/A";
      if (starsSpan) starsSpan.textContent = "N/A";
    }
  }

  fetchRepoInfo();
});

// --- Initialize Clipboard.js ---
if (typeof ClipboardJS !== "undefined") {
  const clipboard = new ClipboardJS(".copy-btn");

  clipboard.on("success", function (e) {
    const button = e.trigger;
    const originalContent = button.innerHTML;
    button.innerHTML = "Copied!";
    setTimeout(() => {
      button.innerHTML = originalContent;
    }, 2000);
    e.clearSelection();
  });

  clipboard.on("error", function (e) {
    console.error("Clipboard Action:", e.action);
    console.error("Clipboard Trigger:", e.trigger);
    // Fallback for error
    const button = e.trigger;
    const originalContent = button.innerHTML;
    button.innerHTML = "Error!";
    setTimeout(() => {
      button.innerHTML = originalContent;
    }, 2000);
  });
}

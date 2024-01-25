document.addEventListener("DOMContentLoaded", initialise);

function initialise() {
  // store data in variable
  let users;
  let repos;

  // select elements
  const form = document.querySelector("form");
  const searchInput = document.querySelector("#search");
  const usersList = document.querySelector("#user-list");
  const reposList = document.querySelector("#repos-list");

  // 1. add event listener for form submit
  form.addEventListener("submit", (e) => {
    // 2. prevent default action
    e.preventDefault();

    usersList.innerHTML = "";
    reposList.innerHTML = "";
    // 3. retrieve search term from form
    let searchTerm = searchInput.value;
    // 4. fetch users with search term
    fetch(`https://api.github.com/search/users?q=${searchTerm}`, {
      headers: {
        Accept: "application/vnd.github.v3+json",
        "Content-Type": "application/json",
      },
    })
      .then((resp) => resp.json())
      .then((data) => {
        let users = data.items;
        users.map((user) => {
          const { login, avatar_url: avatar, url } = user;
          let usersList = document.querySelector("#user-list");
          // create elements
          let li = document.createElement("li");
          let h3 = document.createElement("h3");
          let h4 = document.createElement("h4");
          let p = document.createElement("p");

          // inner html
          h3.innerHTML = login;
          h4.innerHTML = avatar;
          p.innerHTML = url;

          // add to li
          li.appendChild(h3);
          li.appendChild(h4);
          li.appendChild(p);

          // add event listener to li
          li.addEventListener("click", () => {
            fetch(`https://api.github.com/users/${login}/repos`, {
              headers: {
                Accept: "application/vnd.github.v3+json",
                "Content-Type": "application/json",
              },
            })
              .then((resp) => resp.json())
              .then((data) => {
                repos = data;
                reposList.innerHTML = "";
                repos.map((repo) => {
                  const reposList = document.querySelector("#repos-list");
                  let li = document.createElement("li");
                  li.innerHTML = ` - ${repo.description}`;
                  reposList.appendChild(li);
                });
              })
              .catch((error) => console.error(error));
          });

          usersList.appendChild(li);
        });
      })
      .catch((error) => console.error(error));
  });
}

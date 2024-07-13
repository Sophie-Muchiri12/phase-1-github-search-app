document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('github-form');
    const searchInput = document.getElementById('search');
    const userList = document.getElementById('user-list');
    const reposList = document.getElementById('repos-list');

    form.addEventListener('submit', event => {
        event.preventDefault();
        const query = searchInput.value;
        searchUsers(query);
    });

    async function searchUsers(query) {
        const url = `https://api.github.com/search/users?q=${query}`;
        const options = {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            displayUsers(data.items);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    function displayUsers(users) {
        userList.innerHTML = '';
        reposList.innerHTML = '';  // Clear repos list when displaying new users

        users.forEach(user => {
            const userItem = document.createElement('li');
            userItem.innerHTML = `
                <img src="${user.avatar_url}" alt="${user.login}" width="50" height="50">
                <a href="${user.html_url}" target="_blank">${user.login}</a>
                <button data-username="${user.login}">View Repos</button>
            `;
            userList.appendChild(userItem);
        });

        // Add event listeners to the "View Repos" buttons
        document.querySelectorAll('#user-list button').forEach(button => {
            button.addEventListener('click', () => {
                const username = button.getAttribute('data-username');
                getUserRepos(username);
            });
        });
    }

    async function getUserRepos(username) {
        const url = `https://api.github.com/users/${username}/repos`;
        const options = {
            headers: {
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        try {
            const response = await fetch(url, options);
            const data = await response.json();
            displayRepos(data);
        } catch (error) {
            console.error('Error fetching user repos:', error);
        }
    }

    function displayRepos(repos) {
        reposList.innerHTML = '';

        repos.forEach(repo => {
            const repoItem = document.createElement('li');
            repoItem.innerHTML = `
                <a href="${repo.html_url}" target="_blank">${repo.name}</a>
                <p>${repo.description || 'No description'}</p>
            `;
            reposList.appendChild(repoItem);
        });
    }
});
const terminalOverlay = document.getElementById('terminalOverlay');
const terminalInput = document.getElementById('terminalInput');
const terminalOutputDiv = document.getElementById('terminalOutput');

function addLoadingLine() {
  const line = document.createElement('div');
  line.className = 'terminal-output';
  line.style.color = '#fbbf24';
  line.innerHTML = 'Fetching data from GitHub...';
  terminalOutputDiv.appendChild(line);
  return line;
}

function addTerminalLine(text, isError = false) {
  const line = document.createElement('div');
  line.className = 'terminal-output';
  line.style.color = isError ? '#ef4444' : '#10b981';
  line.innerHTML = text;
  terminalOutputDiv.appendChild(line);
  terminalOutputDiv.scrollTop = terminalOutputDiv.scrollHeight;
}

async function fetchGitHubUser(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}`);
    if (!response.ok) throw new Error('User not found');
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

async function fetchGitHubRepos(username) {
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=5`);
    if (!response.ok) throw new Error('Could not fetch repos');
    const data = await response.json();
    return data;
  } catch (error) {
    return null;
  }
}

async function showGitHubProfile(username) {
  const loadingLine = addLoadingLine();
  
  const user = await fetchGitHubUser(username);
  if (!user) {
    loadingLine.remove();
    addTerminalLine(`User "${username}" not found on GitHub`, true);
    return;
  }
  
  loadingLine.remove();
  addTerminalLine(`Name: ${user.name || user.login}`);
  addTerminalLine(`Username: ${user.login}`);
  addTerminalLine(`Location: ${user.location || 'Not set'}`);
  addTerminalLine(`Public repos: ${user.public_repos}`);
  addTerminalLine(`Followers: ${user.followers} | Following: ${user.following}`);
  addTerminalLine(`Profile: ${user.html_url}`);
}

async function showGitHubRepos(username) {
  const loadingLine = addLoadingLine();
  
  const repos = await fetchGitHubRepos(username);
  if (!repos || repos.length === 0) {
    loadingLine.remove();
    addTerminalLine(`No repos found for "${username}"`, true);
    return;
  }
  
  loadingLine.remove();
  addTerminalLine(`Latest 5 repos for ${username}:`);
  repos.forEach((repo, index) => {
    const stars = repo.stargazers_count > 0 ? `Stars: ${repo.stargazers_count}` : 'Stars: 0';
    const language = repo.language ? `Language: ${repo.language}` : 'No language';
    addTerminalLine(`${index + 1}. ${repo.name}`);
    addTerminalLine(`   ${stars} | ${language}`);
    addTerminalLine(`   Description: ${repo.description || 'No description'}`);
    addTerminalLine(`   URL: ${repo.html_url}`);
  });
}

async function processCommand(cmd) {
  const command = cmd.trim().toLowerCase();
  
  if (command === 'help') {
    addTerminalLine('Available Commands:');
    addTerminalLine('  help         - Show this message');
    addTerminalLine('  skills       - View my tech stack');
    addTerminalLine('  projects     - List my projects');
    addTerminalLine('  contact      - Show how to reach me');
    addTerminalLine('  about        - About me');
    addTerminalLine('  clear        - Clear terminal screen');
    addTerminalLine('  exit         - Close terminal');
    addTerminalLine('');
    addTerminalLine('Live GitHub Commands:');
    addTerminalLine('  gh user      - Show my GitHub profile');
    addTerminalLine('  gh repos     - Show my GitHub repos');
    addTerminalLine('  gh lookup username - Show any GitHub user');
    addTerminalLine('  gh repos username  - Show user repos');
  }
  else if (command === 'skills') {
    addTerminalLine('My Skills:');
    addTerminalLine('  JavaScript (ES6+)');
    addTerminalLine('  HTML5 and CSS3');
    addTerminalLine('  React (Learning)');
    addTerminalLine('  Node.js');
    addTerminalLine('  Git and GitHub');
    addTerminalLine('  SQL');
    addTerminalLine('  REST APIs');
    addTerminalLine('  Firebase');
  }
  else if (command === 'projects') {
    addTerminalLine('Current Projects:');
    addTerminalLine('  Terminal Portfolio - Interactive CLI portfolio with terminal mode');
    addTerminalLine('  TaskFlow - Cloud-synced task manager with Google Sign In, Firebase');
    addTerminalLine('  GitHub Stats Visualizer - API integration project (planned)');
  }
  else if (command === 'contact') {
    addTerminalLine('Reach Me:');
    addTerminalLine('  GitHub: github.com/NahomProg');
    addTerminalLine('  Email: nahoma4300@gmail.com');
  }
  else if (command === 'about') {
    addTerminalLine('Nahom Hailu - 3rd year Computer Science student.');
    addTerminalLine('Dedicated learner and developer of things that matter.');
    addTerminalLine('Looking for internships and collaborative opportunities.');
  }
  else if (command === 'clear') {
    terminalOutputDiv.innerHTML = '';
    addTerminalLine('Terminal cleared. Type help for commands.');
  }
  else if (command === 'exit') {
    terminalOverlay.style.display = 'none';
    return;
  }
  else if (command === 'gh user') {
    await showGitHubProfile('NahomProg');
  }
  else if (command === 'gh repos') {
    await showGitHubRepos('NahomProg');
  }
  else if (command.startsWith('gh lookup ')) {
    const username = command.substring(9).trim();
    if (username) {
      await showGitHubProfile(username);
    } else {
      addTerminalLine('Usage: gh lookup username', true);
    }
  }
  else if (command.startsWith('gh repos ')) {
    const username = command.substring(9).trim();
    if (username) {
      await showGitHubRepos(username);
    } else {
      addTerminalLine('Usage: gh repos username', true);
    }
  }
  else if (command !== '') {
    addTerminalLine(`Command not found: ${cmd}. Type help for available commands.`, true);
  }
  
  if (command !== 'clear' && command !== '' && !command.startsWith('gh ')) {
    addTerminalLine('---');
  }
  
  if (command !== 'exit') {
    terminalInput.focus();
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === '`') {
    e.preventDefault();
    terminalOverlay.style.display = 'flex';
    setTimeout(() => {
      terminalInput.focus();
    }, 100);
  }
});

document.getElementById('closeTerminal').addEventListener('click', () => {
  terminalOverlay.style.display = 'none';
});

terminalInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    const cmd = terminalInput.value;
    if (cmd.trim()) {
      addTerminalLine(`$ ${cmd}`);
      processCommand(cmd);
    }
    terminalInput.value = '';
  }
});

terminalOverlay.addEventListener('click', (e) => {
  if (e.target === terminalOverlay) {
    terminalOverlay.style.display = 'none';
  }
});

document.querySelectorAll('.nav-links a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const targetId = this.getAttribute('href').substring(1);
    const target = document.getElementById(targetId);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
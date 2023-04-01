

document.getElementById('resumeDetailsForm').addEventListener('submit', (event) => {
    event.preventDefault();

    const education = document.getElementById('education').value;
    const workExperience = document.getElementById('workExperience').value;
    const personalProjects = document.getElementById('personalProjects').value;
    const skills = document.getElementById('skills').value;
    const apiKey = document.getElementById('apiKey').value;

    chrome.storage.local.set({
        education: education,
        workExperience: workExperience,
        personalProjects: personalProjects,
        skills: skills,
        apiKey: apiKey
    }, () => {
        alert('Resume details saved.');
    });
});

chrome.storage.local.get(['savedCoverLetters'], (result) => {
    const savedCoverLetters = result.savedCoverLetters || {};
    const table = document.getElementById('savedCoverLettersTable');

    for (const [name, coverLetter] of Object.entries(savedCoverLetters)) {
        const row = table.insertRow();
        const nameCell = row.insertCell();
        const coverLetterCell = row.insertCell();

        nameCell.innerHTML = name;
        coverLetterCell.innerHTML = coverLetter;
    }
});

async function generateCoverLetter(jobRequirements, applicantInfo, apiKey, language) {
    const prompt = `Generate a ${language} cover letter for a job application with the following requirements: ${jobRequirements}. The applicant has the following skills and experience: ${applicantInfo}.`;
  
    const apiUrl = "https://api.openai.com/v1/chat/completions";
    console.log(apiKey);
  
    const options = {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: "user", content: prompt }],
        max_tokens: 1800,
      })
    }
  
    const response = await fetch(apiUrl, options);
  
  
    const data = await response.json();
  
    console.log(data);
    return data.choices[0].message.content;
  
  }
  
  
  
  
  function saveCoverLetter(name, coverLetter) {
    chrome.storage.local.get(["savedCoverLetters"], (result) => {
      const savedCoverLetters = result.savedCoverLetters || {};
  
      savedCoverLetters[name] = coverLetter;
  
      chrome.storage.local.set({ savedCoverLetters }, () => {
        console.log(`Cover letter saved under the name "${name}"`);
      });
    });
  }
  
  
  
  
  
  document.getElementById('coverLetterForm').addEventListener('submit', async (event) => {
    event.preventDefault();
  
    // Show the loading container and hide the cover letter result
    document.getElementById('loadingContainer').style.display = 'flex';
    document.getElementById('coverLetterResult').style.display = 'none';
  
  
    const jobRequirements = document.getElementById('jobRequirements').value;
    const language = document.getElementById('language').value;
  
    // Retrieve resume details and apiKey from storage
    chrome.storage.local.get(['education', 'workExperience', 'skills', 'personalProjects', 'apiKey'], async (result) => {
      const education = result.education || '';
      const workExperience = result.workExperience || '';
      const skills = result.skills || '';
      const personalProjects = result.personalProjects || '';
      const apiKey = result.apiKey || '';
  
      if (!apiKey) {
        alert('Please add a ChatGPT API key in the options page.');
        return;
      }
  
      // Combine the education, work experience, skills, and personal projects into a single applicantInfo string.
      const applicantInfo = `Education: ${education}\nWork Experience: ${workExperience}\nSkills: ${skills}\nPersonal Projects: ${personalProjects}`;
  
  
      // Call the generateCoverLetter function with the extracted job requirements, applicantInfo, apiKey, and language.
      const coverLetter = await generateCoverLetter(jobRequirements, applicantInfo, apiKey, language);
  
  
  
      // Hide the loading container and show the cover letter result
      document.getElementById('loadingContainer').style.display = 'none';
      document.getElementById('coverLetterForm').style.display = 'none';
      document.getElementById('coverLetterResult').style.display = 'block';
      document.getElementById('loadingContainer').style.display = 'none';
      document.getElementById('coverLetterTitle').style.display = 'block';
      // Display the generated cover letter in the extension popup.
      document.getElementById('coverLetterResult').innerText = coverLetter;
  
      document.getElementById('saveLabel').style.display = 'block';
      document.getElementById('coverLetterName').style.display = 'inline';
      document.getElementById('saveCoverLetterButton').style.display = 'block';
    });
  });
  
  
  
  
  document.getElementById('saveCoverLetterButton').addEventListener('click', () => {
    const coverLetterName = document.getElementById('coverLetterName').value;
    if (coverLetterName) {
      const coverLetter = document.getElementById('coverLetterResult').innerText;
      saveCoverLetter(coverLetterName, coverLetter);
      alert(`Cover letter saved under the name "${coverLetterName}"`);
    } else {
      alert('Please enter a valid name.');
    }
  });
  
  // Add this code to the popup.js file
  document.getElementById('openOptionsPage').addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
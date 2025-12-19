// careers page - job listings and application form

const careers = {
  jobs: [],
  selectedJob: null,
  
  // initialize careers page
  async init() {
    await this.loadJobs();
    this.setupForm();
  },
  
  // load job listings
  async loadJobs() {
    const container = document.getElementById('jobs-grid');
    if (!container) return;
    
    try {
      // show loading
      utils.showLoading('jobs-grid');
      
      // get jobs
      this.jobs = await api.getJobs();
      
      // filter only open jobs
      const openJobs = this.jobs.filter(j => j.status === 'OPEN');
      
      // display jobs
      this.displayJobs(openJobs);
      
    } catch (error) {
      container.innerHTML = `
        <div class="error-message">
          Failed to load jobs. <button onclick="careers.loadJobs()" class="btn btn-small btn-primary">Try Again</button>
        </div>
      `;
    }
  },
  
  // display job listings
  displayJobs(jobsList) {
    const container = document.getElementById('jobs-grid');
    if (!container) return;
    
    if (jobsList.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>No open positions</h3>
          <p>Check back later for new opportunities!</p>
        </div>
      `;
      return;
    }
    
    container.innerHTML = jobsList.map(job => `
      <div class="job-card" onclick="careers.selectJob(${job.jobId})">
        <div class="job-header">
          <div>
            <h3 class="job-title">${job.title}</h3>
            <div class="job-meta">
              <span>${job.department}</span>
              <span>${job.location}</span>
              <span>${job.jobType}</span>
            </div>
          </div>
          ${job.salaryRange ? `<div class="badge badge-primary">${job.salaryRange}</div>` : ''}
        </div>
        <p class="job-desc">${utils.truncate(job.description, 200)}</p>
      </div>
    `).join('');
  },
  
  // select job and show details
  selectJob(jobId) {
    this.selectedJob = this.jobs.find(j => j.jobId === jobId);
    if (!this.selectedJob) return;
    
    // show modal with job details and application form
    this.showApplicationModal();
  },
  
  // show application modal
  showApplicationModal() {
    const job = this.selectedJob;
    
    const modal = document.createElement('div');
    modal.className = 'modal-overlay';
    modal.innerHTML = `
      <div class="modal">
        <div class="modal-header">
          <h2 class="modal-title">Apply for ${job.title}</h2>
          <button class="modal-close" onclick="this.closest('.modal-overlay').remove()">×</button>
        </div>
        <div class="modal-body">
          <div class="mb-lg">
            <p><strong>Department:</strong> ${job.department}</p>
            <p><strong>Location:</strong> ${job.location}</p>
            <p><strong>Type:</strong> ${job.jobType}</p>
            ${job.salaryRange ? `<p><strong>Salary:</strong> ${job.salaryRange}</p>` : ''}
          </div>
          
          <div class="mb-lg">
            <h4>Description</h4>
            <p>${job.description}</p>
          </div>
          
          <div class="mb-lg">
            <h4>Requirements</h4>
            <p>${job.requirements}</p>
          </div>
          
          <hr class="mb-lg">
          
          <form id="application-form">
            <div id="form-messages"></div>
            
            <div class="form-group">
              <label class="form-label required">Full Name</label>
              <input type="text" name="name" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label class="form-label required">Email</label>
              <input type="email" name="email" class="form-input" required>
            </div>
            
            <div class="form-group">
              <label class="form-label">Phone</label>
              <input type="tel" name="phone" class="form-input">
            </div>
            
            <div class="form-group">
              <label class="form-label required">Resume URL</label>
              <input type="url" name="resumeUrl" class="form-input" placeholder="https://..." required>
              <div class="form-help">Link to your resume (Google Drive, Dropbox, etc.)</div>
            </div>
            
            <div class="form-group">
              <label class="form-label">Cover Letter</label>
              <textarea name="coverLetter" class="form-textarea" rows="6"></textarea>
            </div>
          </form>
        </div>
        <div class="modal-footer">
          <button class="btn btn-secondary" onclick="this.closest('.modal-overlay').remove()">Cancel</button>
          <button class="btn btn-primary" onclick="careers.submitApplication()">Submit Application</button>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // focus first input
    setTimeout(() => {
      modal.querySelector('input')?.focus();
    }, 100);
  },
  
  // setup form handler (for standalone form if not using modal)
  setupForm() {
    const form = document.getElementById('standalone-application-form');
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.submitApplication();
    });
  },
  
  // submit application
  async submitApplication() {
    const form = document.getElementById('application-form');
    if (!form || !this.selectedJob) return;
    
    // validate
    if (!form.checkValidity()) {
      alert('Please fill in all required fields');
      return;
    }
    
    const data = {
      jobId: this.selectedJob.jobId,
      applicantName: form.name.value.trim(),
      email: form.email.value.trim(),
      phone: form.phone.value.trim(),
      resumeUrl: form.resumeUrl.value.trim(),
      coverLetter: form.coverLetter.value.trim()
    };
    
    try {
      // disable button
      const btn = document.querySelector('.modal-footer .btn-primary');
      if (btn) {
        btn.disabled = true;
        btn.textContent = 'Submitting...';
      }
      
      // submit application
      await api.submitJobApplication(data);
      
      // close modal
      document.querySelector('.modal-overlay')?.remove();
      
      // show success
      alert('Application submitted successfully! We will contact you soon.');
      
    } catch (error) {
      // re-enable button
      const btn = document.querySelector('.modal-footer .btn-primary');
      if (btn) {
        btn.disabled = false;
        btn.textContent = 'Submit Application';
      }
      
      alert(error.message || 'Failed to submit application');
    }
  }
};

// initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  careers.init();
});

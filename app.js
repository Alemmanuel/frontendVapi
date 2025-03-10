        // Variables
        const uploadForm = document.getElementById('uploadForm');
        const statusP = document.getElementById('status');
        const pdfInput = document.getElementById('pdfFile');
        const fileName = document.getElementById('fileName');
        const uploadBtn = document.getElementById('uploadBtn');
        const dropArea = document.getElementById('dropArea');
        const welcomeModal = document.getElementById('welcomeModal');
        const closeModalBtn = document.getElementById('closeModal');

        // URLs
        const BACKEND_URL = 'https://aivibackend.onrender.com/upload-pdf';
        const ASSISTANT_URL = 'https://vapi.ai?demo=true&shareKey=0a61baa5-b7fd-44be-b149-7d43533cae73&assistantId=a2aa525c-68ce-4ba4-ba9f-e55d280eac04';

        // Show welcome modal on page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                welcomeModal.classList.remove('opacity-0', 'invisible');
                welcomeModal.querySelector('div').classList.remove('translate-y-5');
            }, 500);
        });

        // Close welcome modal
        closeModalBtn.addEventListener('click', () => {
            welcomeModal.classList.add('opacity-0', 'invisible');
            welcomeModal.querySelector('div').classList.add('translate-y-5');
        });

        // File input change handler
        pdfInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file) {
                fileName.textContent = file.name;
                uploadBtn.disabled = false;
                uploadBtn.classList.remove('disabled:opacity-60', 'disabled:cursor-not-allowed');
            } else {
                fileName.textContent = '';
                uploadBtn.disabled = true;
                uploadBtn.classList.add('disabled:opacity-60', 'disabled:cursor-not-allowed');
            }
        });

        // Drag and drop handlers
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false);
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }

        ['dragenter', 'dragover'].forEach(eventName => {
            dropArea.addEventListener(eventName, highlight, false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, unhighlight, false);
        });

        function highlight() {
            dropArea.classList.add('border-primary', 'bg-primary/10');
            dropArea.classList.remove('border-primary/50');
        }

        function unhighlight() {
            dropArea.classList.remove('border-primary', 'bg-primary/10');
            dropArea.classList.add('border-primary/50');
        }

        dropArea.addEventListener('drop', handleDrop, false);

        function handleDrop(e) {
            const dt = e.dataTransfer;
            const file = dt.files[0];
            
            if (file && file.type === 'application/pdf') {
                pdfInput.files = dt.files;
                fileName.textContent = file.name;
                uploadBtn.disabled = false;
                uploadBtn.classList.remove('disabled:opacity-60', 'disabled:cursor-not-allowed');
            } else {
                alert('Please select a valid PDF file.');
            }
        }

        // Form submission
        uploadForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            statusP.textContent = 'Uploading PDF...';
            uploadBtn.disabled = true;
            uploadBtn.classList.add('disabled:opacity-60', 'disabled:cursor-not-allowed');

            const pdfFile = document.getElementById('pdfFile').files[0];
            if (!pdfFile) {
                alert('Please select a PDF file');
                uploadBtn.disabled = false;
                uploadBtn.classList.remove('disabled:opacity-60', 'disabled:cursor-not-allowed');
                return;
            }

            const formData = new FormData();
            formData.append('pdf', pdfFile);

            try {
                // Send file to backend
                const response = await fetch(BACKEND_URL, {
                    method: 'POST',
                    body: formData
                });
                const data = await response.json();

                if (data.success) {
                    statusP.textContent = 'PDF uploaded successfully. Redirecting to assistant...';
                    setTimeout(() => {
                        window.location.href = ASSISTANT_URL;
                    }, 1500);
                } else {
                    statusP.textContent = `Error: ${data.error || 'Unknown'}`;
                    uploadBtn.disabled = false;
                    uploadBtn.classList.remove('disabled:opacity-60', 'disabled:cursor-not-allowed');
                }
            } catch (error) {
                console.error('Error uploading PDF:', error);
                statusP.textContent = 'Error uploading PDF or connecting to server.';
                uploadBtn.disabled = false;
                uploadBtn.classList.remove('disabled:opacity-60', 'disabled:cursor-not-allowed');
            }
        });
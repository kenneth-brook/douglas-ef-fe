class ListOffice {
    constructor(userRole, userId) {
        this.userRole = userRole;
        this.userId = userId;
        this.container = document.createElement('div');
    }

    render(users) {
        this.container.innerHTML = ''; // Clear existing content

        // Separate users by roles
        const editors = users.filter(user => user.role === 'editor');
        const admins = users.filter(user => user.role === 'administrator');
        const admins365 = users.filter(user => user.role === '365admin');

        // Render sections for each role
        this.renderAdmins365(admins365);
        this.renderAdmins(admins);
        this.renderEditors(editors);

        return this.container;
    }

    renderAdmins365(admins365) {
        if (this.userRole === '365admin') {
            const admins365Section = document.createElement('div');
            admins365Section.innerHTML = '<h3>365 Admins</h3>';
            
            admins365.forEach(admin365 => {
                const adminElement = document.createElement('div');
                adminElement.textContent = admin365.name;

                if (admin365.id === this.userId) {
                    // For logged-in 365admin
                    adminElement.innerHTML += ` <button>Edit Profile</button> <button>Change Password</button>`;
                } else {
                    adminElement.innerHTML += ` <button>Change Password</button> <button>Remove</button>`;
                }

                admins365Section.appendChild(adminElement);
            });

            this.container.appendChild(admins365Section);
        }
    }

    renderAdmins(admins) {
        const adminsSection = document.createElement('div');
        adminsSection.innerHTML = '<h3>Administrators</h3>';
        
        admins.forEach(admin => {
            const adminElement = document.createElement('div');
            adminElement.textContent = admin.name;

            if (admin.id === this.userId) {
                adminElement.innerHTML += ` <button>Edit Profile</button> <button>Change Password</button>`;
            } else {
                adminElement.innerHTML += ` <button>Edit</button> <button>Reset Password</button> <button>Remove</button>`;
            }

            adminsSection.appendChild(adminElement);
        });

        this.container.appendChild(adminsSection);
    }

    renderEditors(editors) {
        const editorsSection = document.createElement('div');
        editorsSection.innerHTML = '<h3>Editors</h3>';
        
        editors.forEach(editor => {
            const editorElement = document.createElement('div');
            editorElement.textContent = editor.name;

            if (editor.id === this.userId) {
                editorElement.innerHTML += ` <button>Edit Profile</button> <button>Change Password</button>`;
            } else if (this.userRole === 'administrator') {
                editorElement.innerHTML += ` <button>Edit</button> <button>Reset Password</button> <button>Remove</button>`;
            }

            editorsSection.appendChild(editorElement);
        });

        this.container.appendChild(editorsSection);
    }
}

export default ListOffice;


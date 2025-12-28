import React from 'react';
import '../styles/Projects.css';

const Projects = () => {
    const projectData = [
        {
            id: 1,
            title: "SMK Telekomunikasi Telesandi",
            category: "Frontend Development",
            url: "https://lutfi-dika.github.io/SMK-TELEKOMUNIKASI-TELESANDI-BEKASI/",
            tags: ["React", "CSS", "AOS"],
        },
        {
            id: 2,
            title: "D&DiShop",
            category: "Frontend Development",
            url: "https://websiteddishop.netlify.app/",
            tags: ["React", "Css"],
        },
        {
            id: 3,
            title: "CakraLogy",
            category: "Frontend Development",
            url: "https://lutfi-dika.github.io/cakralogy/",
            tags: ["React", "Css", "AOS"],
        },
        {
            id: 4,
            title: "Webkraf",
            category: "Frontend Development",
            url: "https://lutfi-dika.github.io/Website-Kreatif/",
            tags: ["React", "Css", "AOS"],
        },
        {
            id: 5,
            title: "Portofolio Website v1",
            category: "Frontend Development",
            url: "https://website-portofolio-andika.netlify.app/",
            tags: ["React", "Css"],
        },
        {
            id: 6,
            title: "My Legacy Portfolio",
            category: "Frontend Development",
            url: "https://lutfi-dika.github.io/MY-Portofolio/",
            tags: ["React", "Css"],
        },
    ];

    return (
        <section className="projects-container">
            <div className="section-header">
                <span className="prefix">03.</span>
                <h2>Featured Projects <span className="title-dot">.</span></h2>
                <div className="line"></div>
            </div>

            <div className="projects-grid">
                {projectData.map((project) => (
                    <div key={project.id} className="project-card">
                        <div className="project-image-wrapper">
                            {/* Menggunakan API Microlink untuk screenshot otomatis */}
                            <img
                                src={`https://api.microlink.io/?url=${encodeURIComponent(project.url)}&screenshot=true&embed=screenshot.url`}
                                alt={project.title}
                                loading="lazy"
                            />
                            <div className="project-overlay">
                                <div className="project-tags">
                                    {project.tags.map((tag, idx) => (
                                        <span key={idx} className="tag">{tag}</span>
                                    ))}
                                </div>
                                <a href={project.url} target="_blank" rel="noreferrer" className="view-btn">
                                    Visit Website ↗
                                </a>
                            </div>
                        </div>

                        <div className="project-details">
                            <span className="project-category">{project.category}</span>
                            <h3 className="project-title">{project.title}</h3>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default Projects;
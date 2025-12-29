import React from 'react';
import '../styles/Contact.css';

const ContactForm = () => {
    return (
        <section className="contact-container">
            <div className="section-header">
                <span className="prefix">06.</span>
                <h2>Get In Touch <span className="title-dot">.</span></h2>
                <div className="line"></div>
            </div>

            <div className="contact-bento">
                {/* Card Kiri: Info Singkat */}
                <div className="contact-card info-card">
                    <h3>Let's talk about anything.</h3>
                    <p>
                        Punya ide proyek atau sekadar ingin menyapa? Silakan isi formulir di samping.
                        Saya akan membalas pesan Anda secepat mungkin.
                    </p>
                    <div className="contact-status">
                        <span className="status-dot"></span> Available for new projects
                    </div>
                </div>

                {/* Card Kanan: Form (Sudah React Version) */}
                <div className="contact-card form-card">
                    <form action="https://formspree.io/f/xzdbvrqw" method="POST" className="modern-form">
                        <div className="form-group">
                            <label htmlFor="email">Username</label>
                            <input
                                type="Username"
                                name="Username"
                                id="Username"
                                placeholder="Username"
                                required
                            />
                        </div>


                        <div className="form-group">
                            <label htmlFor="email">Your Email</label>
                            <input
                                type="email"
                                name="email"
                                id="email"
                                placeholder="name@example.com"
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="message">Your Message</label>
                            <textarea
                                name="message"
                                id="message"
                                placeholder="What's on your mind?"
                                required
                            ></textarea>
                        </div>

                        {/* Hidden honeypot untuk mencegah spam (Opsional tapi disarankan Formspree) */}
                        <input type="hidden" name="_subject" value="New Submission from Portfolio!" />

                        <button type="submit" className="submit-btn">
                            Send Message ↗
                        </button>
                    </form>
                </div>
            </div>
        </section>
    );
};

export default ContactForm;
import React from "react";

export default function ContactModal({
  isOpen,
  contactForm,
  onClose,
  onChange,
  onSubmit,
}) {
  if (!isOpen) {
    return null;
  }

  return (
    <div
      className="contact-modal-overlay"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="contact-modal card"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <h3>문의하기</h3>
        <p className="contact-desc">
          간단한 문의를 남겨주시면 AI 도우미가 답변을 준비합니다.
        </p>
        <form className="contact-form" onSubmit={onSubmit}>
          <label>
            이름
            <input
              type="text"
              name="name"
              placeholder="이름 또는 닉네임"
              value={contactForm.name}
              onChange={onChange}
              required
            />
          </label>
          <label>
            이메일
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              value={contactForm.email}
              onChange={onChange}
              required
            />
          </label>
          <label>
            문의 내용
            <textarea
              name="message"
              placeholder="문의 내용을 작성해 주세요."
              rows={4}
              value={contactForm.message}
              onChange={onChange}
              required
            />
          </label>
          <div className="contact-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              닫기
            </button>
            <button type="submit" className="btn btn-primary">
              문의 보내기
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

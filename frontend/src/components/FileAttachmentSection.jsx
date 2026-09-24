import React, { useRef, useState } from 'react';
import { 
  Paperclip, 
  FileText, 
  Download, 
  Trash2, 
  ExternalLink, 
  Plus, 
  FileCheck
} from 'lucide-react';

export default function FileAttachmentSection({ attachments = [], onUpdateAttachments, onOpenEditModal }) {
  const [isUploading, setIsUploading] = useState(false);
  const [docType, setDocType] = useState('resume');
  const fileInputRef = useRef(null);

  const handleTriggerUpload = (type) => {
    setDocType(type);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      alert('File size exceeds 10MB limit. Please upload a smaller file or link.');
      return;
    }

    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result;
      const formattedSize = file.size > 1024 * 1024 
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      const newAttachment = {
        id: `att-${Date.now()}`,
        name: file.name,
        type: docType,
        size: formattedSize,
        url: dataUrl,
        uploaded_at: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      };

      onUpdateAttachments([...attachments, newAttachment]);
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    };

    reader.onerror = () => {
      alert('Error reading file. Please try again.');
      setIsUploading(false);
    };

    reader.readAsDataURL(file);
  };

  const handleRemove = (attId, e) => {
    e.stopPropagation();
    if (window.confirm('Remove this attachment?')) {
      onUpdateAttachments(attachments.filter(a => a.id !== attId));
    }
  };

  const handleDownload = (att, e) => {
    e.stopPropagation();
    if (!att.url) {
      alert('This is a placeholder document. You can attach a real PDF using "+ Resume" or "+ JD".');
      return;
    }
    const a = document.createElement('a');
    a.href = att.url;
    a.download = att.name || 'document';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleOpen = (att, e) => {
    e.stopPropagation();
    if (!att.url) {
      alert('This is a placeholder document. You can attach a real PDF using "+ Resume" or "+ JD".');
      return;
    }
    const win = window.open();
    if (win) {
      win.document.write(
        `<iframe src="${att.url}" frameborder="0" style="border:0; top:0px; left:0px; bottom:0px; right:0px; width:100%; height:100%;" allowfullscreen></iframe>`
      );
    }
  };

  return (
    <div className="w-full pt-3 border-t border-slate-100">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
        <div className="flex items-center gap-1.5">
          <Paperclip size={13} className="text-slate-500" />
          <span className="text-xs font-bold uppercase tracking-wider text-slate-600">
            Attached Documents ({attachments.length})
          </span>
        </div>

        {/* Direct One-Click Upload Buttons (Zero Cutoff / Clipping Issues) */}
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => handleTriggerUpload('resume')}
            className="text-[11px] font-medium text-emerald-700 hover:text-emerald-800 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-md transition-colors flex items-center gap-1"
            title="Attach your applied resume (PDF/DOC)"
          >
            <FileCheck size={12} className="text-emerald-600" />
            <span>+ Resume</span>
          </button>

          <button
            type="button"
            onClick={() => handleTriggerUpload('jd')}
            className="text-[11px] font-medium text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200 px-2 py-0.5 rounded-md transition-colors flex items-center gap-1"
            title="Attach company job description (JD PDF/DOC)"
          >
            <FileText size={12} className="text-blue-600" />
            <span>+ JD</span>
          </button>

          <button
            type="button"
            onClick={() => handleTriggerUpload('document')}
            className="text-[11px] font-medium text-slate-600 hover:text-slate-800 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-md transition-colors flex items-center gap-0.5"
            title="Attach any other notes or document"
          >
            <Plus size={11} />
            <span>Other</span>
          </button>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.doc,.docx,.txt,.png,.jpg,.jpeg"
            onChange={handleFileUpload}
            className="hidden"
          />
        </div>
      </div>

      {/* Attachments Badges */}
      <div className="flex flex-wrap items-center gap-2">
        {attachments.map((att) => {
          const isResume = att.type === 'resume';
          const isJD = att.type === 'jd';

          return (
            <div
              key={att.id}
              className={`inline-flex items-center gap-2 px-2.5 py-1.5 rounded-lg text-xs font-medium border shadow-2xs transition-all ${
                isResume
                  ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900'
                  : isJD
                    ? 'bg-blue-50/70 border-blue-200 text-blue-900'
                    : 'bg-purple-50/70 border-purple-200 text-purple-900'
              }`}
            >
              {isResume ? (
                <FileCheck size={14} className="text-emerald-600 shrink-0" />
              ) : isJD ? (
                <FileText size={14} className="text-blue-600 shrink-0" />
              ) : (
                <Paperclip size={14} className="text-purple-600 shrink-0" />
              )}

              <div className="flex flex-col">
                <span className="font-semibold truncate max-w-[130px]" title={att.name}>
                  {att.name}
                </span>
                <span className="text-[10px] text-slate-500">
                  {isResume ? 'Resume' : isJD ? 'Job Description' : 'Doc'} {att.size ? `• ${att.size}` : ''}
                </span>
              </div>

              <div className="flex items-center gap-1 ml-1">
                {att.url && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => handleOpen(att, e)}
                      className="p-1 text-slate-500 hover:text-blue-600 hover:bg-white rounded transition-colors"
                      title="View Document"
                    >
                      <ExternalLink size={12} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDownload(att, e)}
                      className="p-1 text-slate-500 hover:text-emerald-600 hover:bg-white rounded transition-colors"
                      title="Download File"
                    >
                      <Download size={12} />
                    </button>
                  </>
                )}
                <button
                  type="button"
                  onClick={(e) => handleRemove(att.id, e)}
                  className="p-1 text-slate-400 hover:text-red-600 hover:bg-white rounded transition-colors"
                  title="Delete Attachment"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}

        {attachments.length === 0 && (
          <div className="text-xs text-slate-400 italic py-1 flex items-center gap-1">
            <span>No files attached yet. Click "+ Resume" or "+ JD" above to attach documents.</span>
          </div>
        )}
      </div>
    </div>
  );
}

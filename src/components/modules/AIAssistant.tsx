import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AIMessage } from '../../types';
import { calculateSubjectAverage } from '../../data/initialData';
import {
  Bot,
  Send,
  Sparkles,
  Copy,
  Check,
  RefreshCw,
  HelpCircle,
  Lightbulb,
  FileQuestion,
  Users,
  ShieldCheck,
  BookOpen,
} from 'lucide-react';

export const AIAssistant: React.FC = () => {
  const { teacher, students, grades, showToast } = useApp();

  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'assistant',
      text: `Xin chào Cô Lưu Hoàng Anh Thư!\n\nEm là **Trợ lý AI chuyên môn Vật lí & Chủ nhiệm lớp 10A5** (Trường THPT Ngô Quyền - Đông Anh).\n\nEm có thể hỗ trợ Cô:\n- 💡 Phân tích kết quả học tập & phát hiện học sinh cần phụ đạo\n- 📝 Thiết kế ma trận đề kiểm tra 4 mức độ theo chuẩn GDPT 2018\n- 📢 Soạn dự thảo nhận xét tuần và bản tin Zalo gửi Phụ huynh\n- 🔬 Gợi ý thí nghiệm trực quan, mô phỏng PhET bài học Vật lí\n\nCô có thể chọn nhanh các câu hỏi gợi ý bên dưới hoặc nhập yêu cầu trực tiếp nhé!`,
      timestamp: '08:00',
    },
  ]);

  const quickPrompts = [
    {
      id: 'qp-1',
      title: 'Phân tích kết quả Vật lí 10A5',
      prompt: 'Hãy phân tích tình hình học tập môn Vật lí của lớp 10A5 dựa trên điểm số hiện tại, nêu rõ các chủ đề học sinh đạt điểm cao và nội dung cần tăng cường luyện tập.',
    },
    {
      id: 'qp-2',
      title: 'Học sinh có điểm giảm & cần phụ đạo',
      prompt: 'Hãy lọc ra những học sinh có điểm dưới 7.0 hoặc cần quan tâm đặc biệt trong lớp 10A5, và đề xuất kế hoạch phụ đạo kiến thức Cơ học cụ thể cho các em.',
    },
    {
      id: 'qp-3',
      title: 'Gợi ý bài giảng Vật lí 10 (CV 5512)',
      prompt: 'Gợi ý cấu trúc kế hoạch bài dạy chuẩn Công văn 5512 cho bài: "Định luật bảo toàn cơ năng và thế năng trọng trường", tích hợp tình huống thực tế và câu hỏi phát triển năng lực.',
    },
    {
      id: 'qp-4',
      title: 'Soạn nhận xét tuần gửi Phụ huynh',
      prompt: 'Soạn giúp cô bản tin tổng kết sinh hoạt tuần gửi lên nhóm Zalo Phụ huynh lớp 10A5, nhấn mạnh nề nếp chuyên cần 97.8% và nhắc nhở ôn thi giữa kỳ.',
    },
    {
      id: 'qp-5',
      title: 'Tạo 5 câu hỏi trắc nghiệm 4 mức độ',
      prompt: 'Biên soạn 5 câu hỏi trắc nghiệm khách quan môn Vật lí 10 chủ đề Định luật II Newton theo 4 mức độ: Biết (2 câu), Hiểu (1 câu), Vận dụng (1 câu), Vận dụng cao (1 câu), có đáp án và lời giải chi tiết.',
    },
    {
      id: 'qp-6',
      title: 'Hoạt động sinh hoạt lớp thứ Bảy',
      prompt: 'Gợi ý kịch bản 45 phút tiết sinh hoạt lớp cuối tuần cho lớp 10A5 với chủ đề: "Phương pháp tự học hiệu quả và tinh thần trách nhiệm trong tập thể".',
    },
  ];

  const handleSendMessage = async (textToSend?: string) => {
    const prompt = (textToSend || inputPrompt).trim();
    if (!prompt || isLoading) return;

    const userMsgId = `usr-${Date.now()}`;
    const newMsg: AIMessage = {
      id: userMsgId,
      sender: 'user',
      text: prompt,
      timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputPrompt('');
    setIsLoading(true);

    // Build anonymized pedagogical context
    const gradeSummaries = students.map((s) => {
      const g = grades[s.id];
      const avg = calculateSubjectAverage(g);
      return {
        maHS: s.id,
        ten: s.name,
        diemTB: avg ?? 8.0,
      };
    });

    const contextPayload = {
      lop: teacher.homeroomClass,
      namHoc: teacher.academicYear,
      hocKy: teacher.semester,
      siSo: students.length,
      tongQuanDiem: gradeSummaries.slice(0, 10),
    };

    try {
      const response = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt,
          context: contextPayload,
        }),
      });

      const data = await response.json();

      const botMsgId = `bot-${Date.now()}`;
      setMessages((prev) => [
        ...prev,
        {
          id: botMsgId,
          sender: 'assistant',
          text: data.text || 'Không nhận được câu trả lời từ hệ thống AI.',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          isOfflineMode: data.isOfflineMode,
        },
      ]);
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `bot-err-${Date.now()}`,
          sender: 'assistant',
          text: 'Xin lỗi Cô Thư, hiện không thể kết nối tới dịch vụ AI. Vui lòng kiểm tra kết nối mạng và khóa API GEMINI_API_KEY trong hệ thống.',
          timestamp: new Date().toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
          isOfflineMode: true,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    showToast('Đã sao chép phản hồi của AI vào khay nhớ tạm!');
    setTimeout(() => setCopiedId(null), 2500);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white rounded-2xl border border-blue-100 p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#1687E8] via-[#0755B8] to-[#29C5E8] text-white flex items-center justify-center shadow-md">
            <Bot className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl sm:text-2xl font-bold text-[#062B65]">
                TRỢ LÝ AI CỦA CÔ THƯ
              </h2>
              <span className="text-xs bg-[#29C5E8]/20 text-[#0755B8] font-bold px-2.5 py-0.5 rounded-full uppercase">
                Gemini 3.8 Flash
              </span>
            </div>
            <p className="text-xs sm:text-sm text-slate-500 font-medium">
              Chuyên gia sư phạm Vật lí THPT & Cố vấn chủ nhiệm lớp 10A5 · THPT Ngô Quyền Đông Anh
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-slate-600">
          <ShieldCheck className="w-4 h-4 text-[#159A61]" />
          <span>Bảo mật dữ liệu học sinh theo quy định GDPT</span>
        </div>
      </div>

      {/* Main Chat Interface Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Quick Suggestion Prompts (4 cols) */}
        <div className="lg:col-span-4 space-y-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-3">
            <h3 className="font-bold text-sm text-[#062B65] flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#1687E8]" />
              <span>Chức năng gợi ý sư phạm</span>
            </h3>

            <div className="space-y-2">
              {quickPrompts.map((qp) => (
                <button
                  key={qp.id}
                  onClick={() => handleSendMessage(qp.prompt)}
                  disabled={isLoading}
                  className="w-full text-left p-3 rounded-xl border border-slate-200 hover:border-[#1687E8] hover:bg-blue-50/50 transition-all text-xs group"
                >
                  <div className="font-bold text-[#062B65] group-hover:text-[#0755B8]">
                    {qp.title}
                  </div>
                  <div className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    {qp.prompt}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Chat History & Input (8 cols) */}
        <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 shadow-sm flex flex-col h-[650px] overflow-hidden">
          {/* Chat Messages */}
          <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-4">
            {messages.map((msg) => {
              const isAssistant = msg.sender === 'assistant';

              return (
                <div
                  key={msg.id}
                  className={`flex gap-3 ${isAssistant ? 'justify-start' : 'justify-end'}`}
                >
                  {isAssistant && (
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-[#0755B8] to-[#29C5E8] text-white flex items-center justify-center shrink-0 shadow-sm">
                      <Bot className="w-5 h-5" />
                    </div>
                  )}

                  <div className={`max-w-[85%] space-y-1.5`}>
                    <div
                      className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                        isAssistant
                          ? 'bg-[#F3F8FF] border border-[#1687E8]/20 text-[#183153]'
                          : 'bg-[#0755B8] text-white rounded-tr-none'
                      }`}
                    >
                      <div className="whitespace-pre-line font-serif">{msg.text}</div>

                      {msg.isOfflineMode && (
                        <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] text-amber-700 italic">
                          ℹ️ Chế độ tư vấn sư phạm định hướng (Chưa liên kết GEMINI_API_KEY).
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
                      <span>{msg.timestamp}</span>
                      {isAssistant && (
                        <button
                          onClick={() => handleCopyMessage(msg.id, msg.text)}
                          className="flex items-center gap-1 hover:text-[#0755B8] transition-colors"
                        >
                          {copiedId === msg.id ? (
                            <>
                              <Check className="w-3 h-3 text-emerald-600" />
                              <span className="text-emerald-600 font-bold">Đã chép</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" />
                              <span>Sao chép</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex items-center gap-3 text-xs text-slate-500 italic p-3 bg-blue-50/50 rounded-xl w-fit">
                <RefreshCw className="w-4 h-4 animate-spin text-[#0755B8]" />
                <span>Trợ lý AI đang suy nghĩ và biên soạn nội dung...</span>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputPrompt}
                onChange={(e) => setInputPrompt(e.target.value)}
                placeholder="Nhập yêu cầu soạn bài, phân tích học sinh, ra đề kiểm tra..."
                disabled={isLoading}
                className="flex-1 px-4 py-2.5 text-xs sm:text-sm bg-white border border-slate-200 rounded-xl outline-none focus:border-[#0755B8] shadow-inner"
              />
              <button
                type="submit"
                disabled={isLoading || !inputPrompt.trim()}
                className="px-4 py-2.5 bg-[#0755B8] hover:bg-[#062B65] disabled:opacity-50 text-white rounded-xl text-xs sm:text-sm font-bold flex items-center gap-1.5 transition-all shadow-sm"
              >
                <Send className="w-4 h-4" />
                <span className="hidden sm:inline">Gửi</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

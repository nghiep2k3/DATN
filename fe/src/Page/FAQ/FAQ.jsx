import React from 'react'

export default function FAQ() {
  return (
    <div className='container-box bg-xanh' style={{height: 1000}}>
        <div className='box-1200px bg-cam'>
            <h1 className='text-center py-5'>Câu hỏi thường gặp (FAQ)</h1>
            <div className='bg-white p-4 rounded-3 shadow-sm'>
                <h3>Câu hỏi 1: Đây là câu hỏi mẫu?</h3>
                <p>Trả lời: Đây là phần trả lời mẫu cho câu hỏi thường gặp. Bạn có thể thay đổi nội dung này theo nhu cầu của mình.</p>
                <h3>Câu hỏi 2: Làm thế nào để sử dụng trang FAQ này?</h3>
                <p>Trả lời: Bạn chỉ cần đọc các câu hỏi và câu trả lời bên dưới để tìm thông tin bạn cần.</p>
                <h3>Câu hỏi 3: Tôi có thể liên hệ ai nếu tôi có thêm câu hỏi?</h3>
                <p>Trả lời: Bạn có thể liên hệ với bộ phận hỗ trợ khách hàng của chúng tôi qua email hoặc số điện thoại được cung cấp trên trang liên hệ.</p>
            </div>
        </div>
    </div>
  )
}

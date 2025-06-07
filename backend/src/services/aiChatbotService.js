const natural = require('natural');
const logger = require('../utils/logger') // Sử dụng logger đã có của bạn

const faqResponses = [
    {
        keywords: ['sản phẩm mới', 'hàng mới về', 'có gì mới'],
        response: 'Chào bạn! Cửa hàng chúng tôi luôn cập nhật những món đồ lưu niệm độc đáo và mới lạ. Bạn có thể xem các sản phẩm mới nhất tại đây: [Link tới trang sản phẩm mới của bạn].'
    },
    {
        keywords: ['thanh toán', 'cách thanh toán', 'phương thức thanh toán'],
        response: 'Cửa hàng chấp nhận nhiều hình thức thanh toán tiện lợi như: Chuyển khoản ngân hàng, thanh toán khi nhận hàng (COD), và các ví điện tử phổ biến. Bạn muốn tìm hiểu chi tiết về hình thức nào?'
    },
    {
        keywords: ['vận chuyển', 'giao hàng', 'phí ship', 'bao lâu nhận được'],
        response: 'Phí vận chuyển sẽ tùy thuộc vào địa chỉ nhận hàng và khối lượng đơn hàng. Thông thường, đơn hàng sẽ được giao trong 2-5 ngày làm việc. Bạn có thể kiểm tra phí ship cụ thể khi đặt hàng nhé.'
    },
    {
        keywords: ['đổi trả', 'trả hàng', 'chính sách đổi hàng'],
        response: 'Chúng tôi có chính sách đổi trả linh hoạt trong vòng 7 ngày nếu sản phẩm có lỗi từ nhà sản xuất hoặc không đúng mô tả. Vui lòng giữ hóa đơn và sản phẩm còn nguyên vẹn. Bạn có thể xem chi tiết chính sách đổi trả tại đây: [Link tới trang chính sách đổi trả của bạn].'
    },
    {
        keywords: ['liên hệ', 'số điện thoại', 'email', 'hỗ trợ'],
        response: 'Để được hỗ trợ nhanh nhất, bạn có thể gọi hotline: [Số điện thoại hotline của bạn] hoặc gửi email về địa chỉ: [Email hỗ trợ của bạn]. Chúng tôi sẵn lòng giúp đỡ!'
    },
    {
        keywords: ['khuyến mãi', 'mã giảm giá', 'sale'],
        response: 'Hiện tại, chúng tôi đang có nhiều chương trình khuyến mãi hấp dẫn! Bạn có thể xem các mã giảm giá và ưu đãi đặc biệt tại trang này: [Link tới trang khuyến mãi của bạn].'
    },
    {
        keywords: ['sản phẩm', 'mua', 'đồ lưu niệm', 'mua đồ'],
        response: 'Bạn đang tìm kiếm loại đồ lưu niệm nào? Hãy cho tôi biết thêm chi tiết để tôi có thể gợi ý sản phẩm phù hợp nhé. Ví dụ: "Tôi muốn mua móc khóa" hoặc "Đồ lưu niệm về Hà Nội".'
    },
];

// xử lý tin nhắn người dùng và tạo phản hồi từ chatbot
async function getBotResponse(userMessage) {
    const lowerCaseMessage = userMessage.toLowerCase();

    for (const faq of faqResponses) {
        for (const keyword of faq.keywords) {
            if (lowerCaseMessage.includes(keyword)) {
                logger.info(`Chatbot matched FAQ keyword: "${keyword}" for message: "${userMessage}"`);
                return faq.response;
            }
        }
    }

    const tokenizer = new natural.WordTokenizer();
    const tokens = tokenizer.tokenize(lowerCaseMessage);

    if (tokens.includes('chào') || tokens.includes('hello')) {
        return 'Chào bạn! Tôi có thể giúp gì cho bạn hôm nay?';
    }

    if (tokens.includes('cảm ơn') || tokens.includes('thank you')) {
        return 'Không có gì! Rất vui được hỗ trợ bạn.';
    }

    // Phản hồi mặc định nếu không tìm thấy bất kỳ sự trùng khớp nào
    return 'Xin lỗi, tôi chưa hiểu rõ yêu cầu của bạn. Bạn có thể diễn đạt lại hoặc chọn một trong các chủ đề sau: sản phẩm mới, thanh toán, vận chuyển, đổi trả, liên hệ, khuyến mãi?';
}

module.exports = {
    getBotResponse
};
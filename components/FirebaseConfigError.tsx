import React from 'react';

const FirebaseConfigError: React.FC<{ projectId: string }> = ({ projectId }) => {
    const identityApiUrl = `https://console.cloud.google.com/apis/library/identitytoolkit.googleapis.com?project=${projectId}`;
    const credentialsUrl = `https://console.cloud.google.com/apis/credentials?project=${projectId}`;

    return (
        <div className="bg-red-50 dark:bg-red-900/50 border-l-4 border-red-500 text-red-700 dark:text-red-200 p-6 rounded-md my-4 space-y-4 shadow-md" role="alert">
            <h3 className="text-xl font-bold flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                Lỗi Cấu Hình Firebase (403 Forbidden)
            </h3>
            <p className="text-sm">
                Lỗi này thường xảy ra do cài đặt trong dự án Firebase/Google Cloud của bạn chưa chính xác, <strong>không phải lỗi trong mã nguồn ứng dụng</strong>. Vui lòng làm theo các bước sau để khắc phục:
            </p>

            <div className="space-y-3 pl-4 border-l-2 border-red-300 dark:border-red-600">
                <div>
                    <h4 className="font-semibold text-md">Bước 1: Kích hoạt Identity Platform API</h4>
                    <p className="text-sm mt-1">Đây là nguyên nhân phổ biến nhất. Dịch vụ xác thực của Firebase cần API này để hoạt động.</p>
                    <a href={identityApiUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700">
                        Mở trang kích hoạt API
                    </a>
                    <p className="text-xs italic mt-1">Hãy chắc chắn rằng bạn đã đăng nhập đúng tài khoản Google quản lý dự án Firebase. Sau khi mở link, nhấn vào nút <strong>"ENABLE" (BẬT)</strong>. Nếu nó đã được bật, hãy chuyển sang bước 2.</p>
                </div>

                <div>
                    <h4 className="font-semibold text-md">Bước 2: Kiểm tra Giới hạn API Key</h4>
                    <p className="text-sm mt-1">API Key của bạn có thể đang bị giới hạn, không cho phép ứng dụng truy cập.</p>
                    <a href={credentialsUrl} target="_blank" rel="noopener noreferrer" className="inline-block mt-2 px-3 py-1 bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700">
                        Mở trang quản lý API Key
                    </a>
                    <ul className="list-disc list-inside text-xs mt-2 space-y-1">
                        <li>Tìm API Key có tên "Browser key (auto created by Firebase)" và nhấn vào đó.</li>
                        <li>Trong mục <strong>Application restrictions (Giới hạn ứng dụng)</strong>, thử chọn <strong>None (Không có)</strong> để gỡ bỏ mọi giới hạn.</li>
                        <li>Trong mục <strong>API restrictions (Giới hạn API)</strong>, đảm bảo bạn đã chọn <strong>Don't restrict key (Không giới hạn key)</strong> hoặc đã cho phép <strong>Identity Toolkit API</strong>.</li>
                    </ul>
                </div>
            </div>

            <p className="text-sm font-medium pt-3 border-t border-red-300 dark:border-red-600">
                Sau khi thực hiện các thay đổi, vui lòng <strong>tải lại trang này</strong> và thử đăng nhập lại.
            </p>
        </div>
    );
};

export default FirebaseConfigError;

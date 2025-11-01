import React, { useState, useRef, useEffect, FormEvent } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useUI } from '../contexts/UIContext';
import { FirebaseError } from 'firebase/app';
import { Role, View } from '../types';

interface UserProfileDropdownProps {
    setView: (view: View) => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ setView }) => {
    const { currentUser, signOutUser, changePassword } = useAuth();
    const { addToast } = useUI();
    const [isOpen, setIsOpen] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const modalRef = useRef<HTMLDivElement>(null);

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [isChangingPassword, setIsChangingPassword] = useState(false);

    useEffect(() => {
        if (!isOpen) return;
        function handleClickOutside(event: MouseEvent) {
            if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isOpen]);

    const handleSignOut = async () => {
        try {
            await signOutUser();
            addToast('Đăng xuất thành công.', 'success');
        } catch (error) {
            addToast('Lỗi khi đăng xuất.', 'error');
        }
    };
    
    const openChangePasswordModal = () => {
        setIsOpen(false);
        setIsModalOpen(true);
        setNewPassword('');
        setConfirmPassword('');
        setPasswordError('');
    };

    const handlePasswordChangeSubmit = async (e: FormEvent) => {
        e.preventDefault();
        if (newPassword.length < 6) {
            setPasswordError('Mật khẩu phải có ít nhất 6 ký tự.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setPasswordError('Mật khẩu xác nhận không khớp.');
            return;
        }
        setPasswordError('');
        setIsChangingPassword(true);
        try {
            await changePassword(newPassword);
            addToast('Đổi mật khẩu thành công!', 'success');
            setIsModalOpen(false);
        } catch (err) {
            console.error(err);
             if (err instanceof FirebaseError && err.code === 'auth/requires-recent-login') {
                setPasswordError('Phiên đăng nhập đã hết hạn. Vui lòng đăng xuất và đăng nhập lại để đổi mật khẩu.');
            } else {
                setPasswordError('Đã xảy ra lỗi. Vui lòng thử lại.');
            }
        } finally {
            setIsChangingPassword(false);
        }
    };

    if (!currentUser) return null;

    const handleNavigateToManagement = () => {
        setView(View.Management);
        setIsOpen(false);
    };

    return (
        <div className="relative" ref={wrapperRef}>
            <button onClick={() => setIsOpen(!isOpen)} className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-200 hidden sm:inline">{currentUser.displayName}</span>
                <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {currentUser.displayName.charAt(0).toUpperCase()}
                </div>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg py-1 z-30 border dark:border-gray-700 dropdown-content origin-top-right">
                    {currentUser.role === Role.Admin && (
                        <button onClick={handleNavigateToManagement} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Quản lý</button>
                    )}
                    <button onClick={openChangePasswordModal} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Đổi mật khẩu</button>
                    <button onClick={handleSignOut} className="w-full text-left block px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700">Đăng xuất</button>
                </div>
            )}
            
            {isModalOpen && (
                 <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
                    <div ref={modalRef} role="dialog" aria-modal="true" aria-labelledby="password-modal-title" className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-sm m-4 modal-content">
                        <h3 id="password-modal-title" className="text-lg font-bold text-gray-900 dark:text-gray-100">Đổi mật khẩu</h3>
                        <form onSubmit={handlePasswordChangeSubmit} className="mt-4 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Mật khẩu mới</label>
                                <input type="password" value={newPassword} onChange={e => setNewPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Xác nhận mật khẩu mới</label>
                                <input type="password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 rounded-md" />
                            </div>
                            {passwordError && <p className="text-sm text-red-500">{passwordError}</p>}
                            <div className="mt-6 flex justify-end space-x-3">
                                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200 dark:bg-gray-600 dark:text-gray-200 dark:hover:bg-gray-500">Hủy</button>
                                <button type="submit" disabled={isChangingPassword} className="px-4 py-2 text-sm font-medium rounded-md text-white bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400">{isChangingPassword ? 'Đang lưu...' : 'Lưu'}</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfileDropdown;

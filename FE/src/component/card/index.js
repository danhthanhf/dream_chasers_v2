import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlayCircle } from '@fortawesome/free-solid-svg-icons';

const CourseOption = () => {
  return (
    <div className="max-w-sm rounded overflow-hidden shadow-lg bg-white text-center p-4">
      <div className="flex justify-center">
        <FontAwesomeIcon icon={faPlayCircle} className="text-4xl text-gray-700" />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2">Khóa học</div>
        <p className="text-gray-700 text-base">
          Các bài giảng video, trắc nghiệm, bài tập coding, v.v. có thể giúp bạn tạo nên trải
          nghiệm học tập phong phú.
        </p>
      </div>
    </div>
  );
};

export default CourseOption;

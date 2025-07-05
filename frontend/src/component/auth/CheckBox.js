import React, { useState } from 'react';

function Checkbox() {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <div>
      {/* Sử dụng input type="checkbox" và thêm thuộc tính checked và onChange */}
      <input
        type="checkbox"
        checked={isChecked}
        onChange={() => setIsChecked(!isChecked)}
      />
      <label></label>
    </div>
  );
}

export default Checkbox;

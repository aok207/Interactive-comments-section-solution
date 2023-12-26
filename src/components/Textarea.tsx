
interface TextAreaProp {
  placeHolder: string;
  value: string | null;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}

function Textarea({ placeHolder, value, onChange }: TextAreaProp) {

  return (
    <div>
      <textarea
        name="comment"
        id="comment"
        cols={30}
        rows={4}
        placeholder={placeHolder}
        className="border-light-grayish-blue resize-none 
        border-2 rounded-md focus:border-2 focus:border-moderate-blue focus:outline-none w-full py-3 px-6 text-[16px]"
        value={value !== null ? value : ""}
        onChange={(e) => onChange(e)}
      ></textarea>
    </div>
  );
}

export default Textarea;

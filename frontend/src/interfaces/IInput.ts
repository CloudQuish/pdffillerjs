export default interface IInput {
  control: any;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: { label: string; value: string }[];
  help?: string;
  text?: string;
  disabled?: boolean;
  alignment?: "horizontal" | "vertical";
  disabled_date_in_past?: boolean;
  input_box_type?: "normal" | "textarea";
  total_no_of_digits?: number;
}

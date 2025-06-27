import { FieldPropContext } from "./formTypes";

export type SupportedPrimitive = string | number | boolean | null;
export type SupportedArray = Array<
  SupportedPrimitive | SupportedObject | SupportedArray
>;
export type SupportedObject = {
  [key: string]: SupportedPrimitive | SupportedArray | SupportedObject;
};

export type SupportedTypes =
  | SupportedPrimitive
  | SupportedArray
  | SupportedObject;

export type ComputedValue<T> = {
  fn: (context: FieldPropContext) => T;
  dependsOn?: string[];
  defaultValue?: T;
  isAsync?: boolean;
};

export type FunctionOrValue<T extends SupportedTypes> =
  | T
  | ComputedValue<T> //if trying to use of function, this is the recommended type
  | ((context: FieldPropContext) => T); //legacy support for functions

export type TFieldLabel = string;
export type TFieldRequired = boolean;
export type TFieldDisabled = boolean;
export type TFieldRequiredMessage = string;
export type TFieldVisibility =
  | boolean
  | {
      dependsOn: FieldIdType[] | FieldIdType;
      condition: VisibilityConditionType;
      value: string | number;
    };

export type FieldIdType = string;
export type FieldTypeType = string;
export type FieldLabelType = FunctionOrValue<TFieldLabel>;
export type FieldRequiredType = FunctionOrValue<TFieldRequired>;
export type FieldRequiredMessageType = FunctionOrValue<TFieldRequiredMessage>;
export type VisibilityConditionType = "equals" | "not_equals";
export type FieldVisibilityType = FunctionOrValue<TFieldVisibility>;
export type FieldClassNameType = string;
export type FieldStyleType = React.CSSProperties;
export type FieldDisabledType = FunctionOrValue<TFieldDisabled>;
export type FieldDefaultValueType = SupportedTypes;
export type FieldPlaceholderType = string;
export type FieldAutoCorrectType = "on" | "off";
export type FieldAutoCapitalizeType =
  | "on"
  | "off"
  | "sentences"
  | "words"
  | "characters";
export type FieldSpellCheckType = boolean;
export type FieldAutoFocusType = boolean;
export type FieldStepType = number;
export type FieldInputType =
  | "text"
  | "number"
  | "email"
  | "password"
  | "url"
  | "tel"
  | "search";
export type FieldDatepickerType = "date";
export type FieldSelectType = "select";
export type FieldRadioType = "radio";
export type FieldCheckboxType = "checkbox";
export type FieldTextareaType = "textarea";
export type FieldGroupType = "group";
export type FieldGridViewType = "gridview";
export type FieldSpacerType = "spacer";
export type FieldContainerType = "container";
export type FieldInputFileType = "file";
export type FieldTextareaRowsType = number;
export type FieldTextareaColsType = number;
export type FieldAsHTMLContainerTagType =
  | "div"
  | "section"
  | "article"
  | "main"
  | "header"
  | "footer";
export type WidthType = string | number;
export type HeightType = string | number;

export type OptionsType =
  | string
  | {
      value: string | number;
      label: string | number;
    };
export type ExtractFieldIds<T extends { fieldId: string }[]> =
  T[number]["fieldId"];

export type FormIdType = string;
export type TitleType = string;
export type BaseUrlType = string;
export type DescriptionType = string;
export type APIEndpointType = string;
export type APIMethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
export type APIDependsOnType = string | string[];
export type APIParamsType = Record<string, string>;
export type APIHeadersType = Record<string, string>;
export type APITransformResponseType = (
  response: any
) => { label: string; value: any }[] | string[];
export type APIResultPathType = string;
export type APIfetchOnInitType = boolean;
export type FormValuesType = Record<FieldIdType, any>;
export type FormErrorsType = Record<FieldIdType, string>;
export type FieldDynamicOptionsType = Record<FieldIdType, any[]>;
export type ChildrenType = React.ReactNode;
export type ShowSkeletonLoadingType = boolean;

export type ValidationPatternType = string;
export type MessageType = string;
export type MinType = number;
export type MaxType = number;
export type MinLengthType = number;
export type MaxLengthType = number;
export type ValidationCustomRuleType = (value: any) => boolean;
export type ColumnsType = number;
export type GapType = number;
export type DependencyMap = Record<FieldIdType, Set<FieldIdType>>;
export type DependencyMapTuple = [DependencyMap, DependencyMap];

export type FileAcceptType = string | string[];
export type FileMultipleType = boolean;
export type FileMaxSizeMBType = number;
export type FileMinFilesType = number;
export type FilePreviewType = boolean;
export type FileUploadUrlType = string;
export type FileUploadHeadersType = string;
export type FileUploadMethodType = "POST" | "PUT" | "PATCH";
export type FilePresignedUrlFnType = string;
export type FileFileTypesType = string[];
export type FileRenameFileType = boolean;
export type FileStoreLocallyType = boolean;
export type FileStorageFormatType =
  | "file" // Raw File object
  | "fileList" // FileList
  | "base64" // Base64 string
  | "blobUrl" // Blob URL
  | "arrayBuffer" // ArrayBuffer
  | "remoteUrl" // Remote URL string
  | "metadata"; // Custom metadata object;

export type FieldDescriptionType = string;

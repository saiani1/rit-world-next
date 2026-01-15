type ReadOnlyFieldProps = {
  label: string;
  value: string | null | undefined;
  isLink?: boolean;
};

export const ReadOnlyField = ({
  label,
  value,
  isLink = false,
}: ReadOnlyFieldProps) => (
  <div>
    <dt className="text-xs font-medium text-gray-500 mb-1">{label}</dt>
    <dd className="text-md text-gray-900 min-h-[20px]">
      {value ? (
        isLink ? (
          <a
            href={value}
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline break-all"
          >
            {value}
          </a>
        ) : (
          <span className="whitespace-pre-wrap">{value}</span>
        )
      ) : (
        <span className="text-gray-300">-</span>
      )}
    </dd>
  </div>
);

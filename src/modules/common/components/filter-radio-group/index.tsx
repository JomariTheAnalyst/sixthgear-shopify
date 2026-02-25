import { RadioGroup } from "@headlessui/react"
import { Circle as EllipseMiniSolid } from "lucide-react"
import { cn } from "@lib/util/cn"

type FilterRadioGroupProps = {
  title: string
  items: {
    value: string
    label: string
  }[]
  value: any
  handleChange: (...args: any[]) => void
  "data-testid"?: string
}

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  "data-testid": dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex gap-x-3 flex-col gap-y-3">
      <span className="txt-compact-small-plus text-gray-400">{title}</span>
      <RadioGroup data-testid={dataTestId} onChange={handleChange} value={value}>
        {items?.map((i) => (
          <div
            key={i.value}
            className={cn("flex gap-x-2 items-center", {
              "ml-[-23px]": i.value === value,
            })}
          >
            {i.value === value && <EllipseMiniSolid />}
            <RadioGroup.Option
              className="hidden peer"
              id={i.value}
              value={i.value}
            />
            <label
              htmlFor={i.value}
              className={cn(
                "!txt-compact-small !transform-none text-gray-500 hover:cursor-pointer",
                {
                  "text-gray-900": i.value === value,
                }
              )}
              data-testid="radio-label"
              data-active={i.value === value}
            >
              {i.label}
            </label>
          </div>
        ))}
      </RadioGroup>
    </div>
  )
}

export default FilterRadioGroup

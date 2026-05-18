"use client"

import { HttpTypes } from "@medusajs/types"
import NativeSelect, {
  NativeSelectProps,
} from "@modules/common/components/native-select"

type CountrySelectProps = Omit<NativeSelectProps, "children" | "placeholder"> & {
  region?: HttpTypes.StoreRegion | null
}

const CountrySelect = ({
  region,
  defaultValue,
  ...props
}: CountrySelectProps) => {
  const countries = region?.countries ?? []
  const fallbackValue = countries[0]?.iso_2

  return (
    <div className="flex flex-col w-full">
      <label className="mb-2 text-sm font-medium text-gray-700">
        Country
        {props.required && <span className="text-rose-500">*</span>}
      </label>
      <NativeSelect
        {...props}
        defaultValue={defaultValue || fallbackValue || ""}
        placeholder="Select country"
      >
        {countries.map((country) => (
          <option key={country.iso_2} value={country.iso_2}>
            {country.display_name || country.name || country.iso_2?.toUpperCase()}
          </option>
        ))}
      </NativeSelect>
    </div>
  )
}

export default CountrySelect

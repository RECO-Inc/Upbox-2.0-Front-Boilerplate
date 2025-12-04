<script setup lang="ts">
import {computed, ref} from 'vue'
import type {DateValue} from '@internationalized/date'
import {useI18n} from 'vue-i18n'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {Checkbox} from '@/components/ui/checkbox'
import {Switch} from '@/components/ui/switch'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
import {DropdownFilter} from '@/components/ui/dropdown-filter'
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs'
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card'
import {Badge} from '@/components/ui/badge'
import {Avatar, AvatarFallback, AvatarImage} from '@/components/ui/avatar'
import {Separator} from '@/components/ui/separator'
import {Spinner} from '@/components/ui/spinner'
import {Toggle} from '@/components/ui/toggle'
import {ToggleGroup, ToggleGroupItem} from '@/components/ui/toggle-group'
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow} from '@/components/ui/table'
import {Calendar} from '@/components/ui/calendar'
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover'
import {Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger} from '@/components/ui/drawer'
import {Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger} from '@/components/ui/dialog'
import {NumberField, NumberFieldContent, NumberFieldDecrement, NumberFieldIncrement, NumberFieldInput} from '@/components/ui/number-field'
import {Skeleton} from '@/components/ui/skeleton'
import {Accordion, AccordionContent, AccordionItem, AccordionTrigger} from '@/components/ui/accordion'
import {Pagination, PaginationContent, PaginationEllipsis, PaginationFirst, PaginationLast, PaginationItem, PaginationNext, PaginationPrevious} from '@/components/ui/pagination'
import {Bold, Calendar as CalendarIcon, Italic, Underline, Heart, Download, ChevronRight, Minus, Plus} from 'lucide-vue-next'
import {useDate} from '@/composables/useDate'

import {useWasteType} from '@/composables/useWasteType'

const {t, locale} = useI18n()
const { wasteTypeDetailOptions } = useWasteType()

const inputValue = ref('')
const textareaValue = ref('')
const checkboxValue = ref(false)
const switchValue = ref(false)
const radioValue = ref('option1')
const selectValue = ref('')

// DropdownFilter states
const multiFilterValue = ref<string[]>([])
const singleFilterValue = ref<string[]>([])
const searchFilterValue = ref<string[]>([])
const highlightFilterValue = ref<string[]>([])
const toggleValue = ref(false)
const toggleGroupValue = ref('center')
const calendarDate = ref<DateValue>()
const isCalendarOpen = ref(false)
const numberValue = ref(5)
const currentPage = ref(1)

// Enhanced Input states
const enhancedBasicInput = ref('')
const enhancedSmallInput = ref('')
const enhancedRegularInput = ref('')
const enhancedLargeInput = ref('')
const enhancedDefaultInput = ref('')
const enhancedFilledInput = ref('')
const enhancedBottomlineInput = ref('')
const enhancedClearableInput = ref('')
const enhancedPasswordInput = ref('')
const enhancedSubfixInput = ref('25')
const enhancedCounterInput = ref('')
const enhancedByteInput = ref('')
const enhancedErrorInput = ref('')
const enhancedDisabledInput = ref('Disabled value')
const enhancedReadonlyInput = ref('Readonly value')

// Enhanced Textarea states
const enhancedBasicTextarea = ref('')
const enhancedAutoResizeTextarea = ref('')
const enhancedCounterTextarea = ref('')
const enhancedDefaultTextarea = ref('')
const enhancedFilledTextarea = ref('')
const enhancedBottomlineTextarea = ref('')
const enhancedErrorTextarea = ref('')
const enhancedDisabledTextarea = ref('Disabled textarea')

// Enhanced Button states
const isButtonLoading = ref(false)
const handleLoadingClick = () => {
  isButtonLoading.value = true
  setTimeout(() => {
    isButtonLoading.value = false
  }, 2000)
}

// Date utilities
const dateUtil = useDate()

// Handle calendar date selection
const handleDateSelect = (date: DateValue | undefined) => {
  calendarDate.value = date
  isCalendarOpen.value = false
}

// Convert DateValue to Date for dayjs
const toDate = (dateValue: DateValue | undefined): Date | undefined => {
  if (!dateValue) return undefined
  return new Date(dateValue.year, dateValue.month - 1, dateValue.day)
}

// Date examples
const formattedDate = computed(() => {
  const date = toDate(calendarDate.value)
  if (!date) return t('playground.calendar.none')
  return locale.value === 'ko'
    ? dateUtil.format(date, 'YYYY년 MM월 DD일')
    : dateUtil.format(date, 'YYYY-MM-DD')
})
const localizedDate = computed(() => {
  const date = toDate(calendarDate.value)
  return date ? dateUtil.formatLocalized(date, 'LL') : t('playground.calendar.none')
})
const relativeDate = computed(() => {
  const date = toDate(calendarDate.value)
  return date ? dateUtil.fromNow(date) : t('playground.calendar.none')
})
const weekdayName = computed(() => {
  const date = toDate(calendarDate.value)
  if (!date) return t('playground.calendar.none')
  const weekdayIndex = dateUtil.weekday(date)
  const weekdayKeys = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
  return t(`playground.calendar.weekdays.${weekdayKeys[weekdayIndex]}`)
})

// Display date in button
const displayDate = computed(() => {
  const date = toDate(calendarDate.value)
  if (!date) return t('playground.calendar.pickDate')
  return locale.value === 'ko'
    ? dateUtil.format(date, 'YYYY년 MM월 DD일')
    : dateUtil.format(date, 'YYYY-MM-DD')
})
</script>

<template>
  <SidebarProvider>
    <AppSidebar />
    <SidebarInset>
      <AppHeader />
      <main class="min-h-screen p-6 pt-20">
        <div class="mx-auto max-w-7xl space-y-8">
          <!-- Header -->
          <div class="space-y-2">
            <h1 class="text-size-32 font-bold">{{ t('playground.title') }}</h1>
            <p class="text-base-60">{{ t('playground.description') }}</p>
          </div>

          <!-- Tabs for organized sections -->
          <Tabs default-value="inputs" class="w-full">
            <TabsList class="grid w-full grid-cols-6">
              <TabsTrigger value="inputs">{{ t('playground.tabs.inputs') }}</TabsTrigger>
              <TabsTrigger value="buttons">{{ t('playground.tabs.buttons') }}</TabsTrigger>
              <TabsTrigger value="data">{{ t('playground.tabs.data') }}</TabsTrigger>
              <TabsTrigger value="feedback">{{ t('playground.tabs.feedback') }}</TabsTrigger>
              <TabsTrigger value="overlays">{{ t('playground.tabs.overlays') }}</TabsTrigger>
              <TabsTrigger value="navigation">{{ t('playground.tabs.navigation') }}</TabsTrigger>
            </TabsList>

            <!-- Inputs Tab -->
            <TabsContent value="inputs" class="space-y-6">
              <!-- Input Showcase -->
              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.enhancedInput.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.enhancedInput.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="space-y-8">
                  <!-- Basic Input -->
                  <div class="space-y-4">
                    <h3 class="text-size-16 font-semibold text-base-80">{{ t('playground.enhancedInput.basicTitle') }}</h3>
                    <Input
                      v-model="enhancedBasicInput"
                      :label="t('playground.enhancedInput.basicLabel')"
                      :placeholder="t('playground.enhancedInput.basicPlaceholder')"
                      required
                    />
                  </div>

                  <Separator />

                  <!-- Size Variants -->
                  <div class="space-y-4">
                    <h3 class="text-size-16 font-semibold text-base-80">{{ t('playground.enhancedInput.sizesTitle') }}</h3>
                    <Input
                      v-model="enhancedSmallInput"
                      :label="t('playground.enhancedInput.smallLabel')"
                      :placeholder="t('playground.enhancedInput.placeholder')"
                      size="sm"
                    />
                    <Input
                      v-model="enhancedRegularInput"
                      :label="t('playground.enhancedInput.regularLabel')"
                      :placeholder="t('playground.enhancedInput.placeholder')"
                      size="md"
                    />
                    <Input
                      v-model="enhancedLargeInput"
                      :label="t('playground.enhancedInput.largeLabel')"
                      :placeholder="t('playground.enhancedInput.placeholder')"
                      size="lg"
                    />
                  </div>

                  <Separator />

                  <!-- Style Variants -->
                  <div class="space-y-4">
                    <h3 class="text-size-16 font-semibold text-base-80">{{ t('playground.enhancedInput.variantsTitle') }}</h3>
                    <Input
                      v-model="enhancedDefaultInput"
                      :label="t('playground.enhancedInput.defaultLabel')"
                      :placeholder="t('playground.enhancedInput.placeholder')"
                      variant="default"
                    />
                    <Input
                      v-model="enhancedFilledInput"
                      :label="t('playground.enhancedInput.filledLabel')"
                      :placeholder="t('playground.enhancedInput.placeholder')"
                      variant="filled"
                    />
                    <Input
                      v-model="enhancedBottomlineInput"
                      :label="t('playground.enhancedInput.bottomlineLabel')"
                      :placeholder="t('playground.enhancedInput.placeholder')"
                      variant="bottomline"
                    />
                  </div>

                  <Separator />

                  <!-- Features -->
                  <div class="space-y-4">
                    <h3 class="text-size-16 font-semibold text-base-80">{{ t('playground.enhancedInput.featuresTitle') }}</h3>
                    <Input
                      v-model="enhancedClearableInput"
                      :label="t('playground.enhancedInput.clearableLabel')"
                      :placeholder="t('playground.enhancedInput.placeholder')"
                      clearable
                    />
                    <Input
                      v-model="enhancedPasswordInput"
                      :label="t('playground.enhancedInput.passwordLabel')"
                      placeholder="Enter password"
                      password
                    />
                    <Input
                      v-model="enhancedSubfixInput"
                      :label="t('playground.enhancedInput.withSubfixLabel')"
                      :placeholder="t('playground.enhancedInput.placeholder')"
                      :subfix="t('playground.enhancedInput.years')"
                    />
                    <Input
                      v-model="enhancedCounterInput"
                      :label="t('playground.enhancedInput.withCounterLabel')"
                      :placeholder="t('playground.enhancedInput.placeholder')"
                      counter
                      :max-length="50"
                    />
                    <Input
                      v-model="enhancedByteInput"
                      :label="t('playground.enhancedInput.withByteCounterLabel')"
                      :placeholder="t('playground.enhancedInput.placeholder')"
                      counter
                      byte-mode
                      :max-length="100"
                    />
                  </div>

                  <Separator />

                  <!-- States -->
                  <div class="space-y-4">
                    <h3 class="text-size-16 font-semibold text-base-80">{{ t('playground.enhancedInput.statesTitle') }}</h3>
                    <Input
                      v-model="enhancedErrorInput"
                      :label="t('playground.enhancedInput.errorLabel')"
                      :placeholder="t('playground.enhancedInput.placeholder')"
                      :error-message="t('playground.enhancedInput.errorMessage')"
                      error
                    />
                    <Input
                      v-model="enhancedDisabledInput"
                      :label="t('playground.enhancedInput.disabledLabel')"
                      disabled
                    />
                    <Input
                      v-model="enhancedReadonlyInput"
                      :label="t('playground.enhancedInput.readonlyLabel')"
                      readonly
                    />
                  </div>
                </CardContent>
              </Card>

              <!-- Enhanced Textarea Showcase -->
              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.enhancedTextarea.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.enhancedTextarea.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="space-y-8">
                  <!-- Basic Textarea -->
                  <div class="space-y-4">
                    <h3 class="text-size-16 font-semibold text-base-80">{{ t('playground.enhancedTextarea.basicTitle') }}</h3>
                    <Textarea
                      v-model="enhancedBasicTextarea"
                      :label="t('playground.enhancedTextarea.basicLabel')"
                      :placeholder="t('playground.enhancedTextarea.basicPlaceholder')"
                      required
                    />
                  </div>

                  <Separator />

                  <!-- Auto Resize -->
                  <div class="space-y-4">
                    <h3 class="text-size-16 font-semibold text-base-80">{{ t('playground.enhancedTextarea.autoResizeTitle') }}</h3>
                    <Textarea
                      v-model="enhancedAutoResizeTextarea"
                      :label="t('playground.enhancedTextarea.autoResizeLabel')"
                      :placeholder="t('playground.enhancedTextarea.autoResizePlaceholder')"
                      auto-resize
                      :min-height="60"
                      :max-height="200"
                    />
                  </div>

                  <Separator />

                  <!-- With Counter -->
                  <div class="space-y-4">
                    <h3 class="text-size-16 font-semibold text-base-80">{{ t('playground.enhancedTextarea.withCounterTitle') }}</h3>
                    <Textarea
                      v-model="enhancedCounterTextarea"
                      :label="t('playground.enhancedTextarea.withCounterLabel')"
                      :placeholder="t('playground.enhancedTextarea.withCounterPlaceholder')"
                      counter
                      :max-length="200"
                    />
                  </div>

                  <Separator />

                  <!-- Style Variants -->
                  <div class="space-y-4">
                    <h3 class="text-size-16 font-semibold text-base-80">{{ t('playground.enhancedTextarea.variantsTitle') }}</h3>
                    <Textarea
                      v-model="enhancedDefaultTextarea"
                      :label="t('playground.enhancedTextarea.defaultLabel')"
                      :placeholder="t('playground.enhancedTextarea.placeholder')"
                      variant="default"
                    />
                    <Textarea
                      v-model="enhancedFilledTextarea"
                      :label="t('playground.enhancedTextarea.filledLabel')"
                      :placeholder="t('playground.enhancedTextarea.placeholder')"
                      variant="filled"
                    />
                    <Textarea
                      v-model="enhancedBottomlineTextarea"
                      :label="t('playground.enhancedTextarea.bottomlineLabel')"
                      :placeholder="t('playground.enhancedTextarea.placeholder')"
                      variant="bottomline"
                    />
                  </div>

                  <Separator />

                  <!-- States -->
                  <div class="space-y-4">
                    <h3 class="text-size-16 font-semibold text-base-80">{{ t('playground.enhancedTextarea.statesTitle') }}</h3>
                    <Textarea
                      v-model="enhancedErrorTextarea"
                      :label="t('playground.enhancedTextarea.errorLabel')"
                      :placeholder="t('playground.enhancedTextarea.placeholder')"
                      :error-message="t('playground.enhancedTextarea.errorMessage')"
                      error
                    />
                    <Textarea
                      v-model="enhancedDisabledTextarea"
                      :label="t('playground.enhancedTextarea.disabledLabel')"
                      disabled
                    />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.checkbox.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.checkbox.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="flex items-center space-x-2">
                    <Checkbox id="terms" v-model="checkboxValue" />
                    <label for="terms" class="text-size-14 font-medium">{{ t('playground.checkbox.acceptTerms') }}</label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Switch id="airplane" v-model="switchValue" />
                    <label for="airplane" class="text-size-14 font-medium">{{ t('playground.checkbox.airplaneMode') }}</label>
                  </div>
                  <p class="text-size-14 text-base-60">{{ t('playground.checkbox.checkboxLabel') }}: {{ checkboxValue }}, {{ t('playground.checkbox.switchLabel') }}: {{ switchValue }}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.radio.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.radio.description') }}</CardDescription>
                </CardHeader>
                <CardContent>
                  <RadioGroup v-model="radioValue">
                    <div class="flex items-center space-x-2">
                      <RadioGroupItem id="option1" value="option1" />
                      <label for="option1">{{ t('playground.radio.option1') }}</label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <RadioGroupItem id="option2" value="option2" />
                      <label for="option2">{{ t('playground.radio.option2') }}</label>
                    </div>
                    <div class="flex items-center space-x-2">
                      <RadioGroupItem id="option3" value="option3" />
                      <label for="option3">{{ t('playground.radio.option3') }}</label>
                    </div>
                  </RadioGroup>
                  <p class="mt-4 text-size-14 text-base-60">{{ t('playground.radio.selected') }}: {{ radioValue }}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.select.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.select.description') }}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select v-model="selectValue">
                    <SelectTrigger class="w-full">
                      <SelectValue :placeholder="t('playground.select.placeholder')" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apple">{{ t('playground.select.apple') }}</SelectItem>
                      <SelectItem value="banana">{{ t('playground.select.banana') }}</SelectItem>
                      <SelectItem value="orange">{{ t('playground.select.orange') }}</SelectItem>
                    </SelectContent>
                  </Select>
                  <p class="mt-4 text-size-14 text-base-60">{{ t('playground.select.selected') }}: {{ selectValue }}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('ui.component.dropdownFilter.title') }}</CardTitle>
                  <CardDescription>{{ t('ui.component.dropdownFilter.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="space-y-6">
                  <!-- Multi Select -->
                  <div class="space-y-2">
                    <label class="text-size-14 font-medium">{{ t('ui.component.dropdownFilter.multiSelectLabel') }}</label>
                    <DropdownFilter
                      v-model="multiFilterValue"
                      :options="wasteTypeDetailOptions"
                      :placeholder="t('playground.select.placeholder')"
                    />
                    <p class="text-size-12 text-base-60">{{ t('playground.select.selected') }}: {{ multiFilterValue.join(', ') || '-' }}</p>
                  </div>

                  <!-- Single Select -->
                  <div class="space-y-2">
                    <label class="text-size-14 font-medium">{{ t('ui.component.dropdownFilter.singleSelectLabel') }}</label>
                    <DropdownFilter
                      v-model="singleFilterValue"
                      :options="wasteTypeDetailOptions"
                      :placeholder="t('playground.select.placeholder')"
                      single
                    />
                    <p class="text-size-12 text-base-60">{{ t('playground.select.selected') }}: {{ singleFilterValue.join(', ') || '-' }}</p>
                  </div>

                  <!-- With Search -->
                  <div class="space-y-2">
                    <label class="text-size-14 font-medium">{{ t('ui.component.dropdownFilter.searchableLabel') }}</label>
                    <DropdownFilter
                      v-model="searchFilterValue"
                      :options="wasteTypeDetailOptions"
                      :placeholder="t('playground.select.placeholder')"
                      search
                    />
                    <p class="text-size-12 text-base-60">{{ t('playground.select.selected') }}: {{ searchFilterValue.join(', ') || '-' }}</p>
                  </div>

                  <!-- Highlight Style -->
                  <div class="space-y-2">
                    <label class="text-size-14 font-medium">{{ t('ui.component.dropdownFilter.highlightLabel') }}</label>
                    <DropdownFilter
                      v-model="highlightFilterValue"
                      :options="wasteTypeDetailOptions"
                      :placeholder="t('playground.select.placeholder')"
                      display-style="highlight"
                    />
                    <p class="text-size-12 text-base-60">{{ t('playground.select.selected') }}: {{ highlightFilterValue.join(', ') || '-' }}</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.numberField.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.numberField.description') }}</CardDescription>
                </CardHeader>
                <CardContent>
                  <NumberField
                    v-model="numberValue"
                    :min="0"
                    :max="10"
                  >
                    <label class="text-size-14 font-medium mb-2 block">{{ t('playground.numberField.label') }}</label>
                    <NumberFieldContent>
                      <NumberFieldDecrement>
                        <Minus class="h-4 w-4" />
                      </NumberFieldDecrement>
                      <NumberFieldInput />
                      <NumberFieldIncrement>
                        <Plus class="h-4 w-4" />
                      </NumberFieldIncrement>
                    </NumberFieldContent>
                  </NumberField>
                  <p class="mt-4 text-size-14 text-base-60">{{ t('playground.input.value') }}: {{ numberValue }}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <!-- Buttons Tab -->
            <TabsContent value="buttons" class="space-y-6">
              <!-- Button Showcase (LinkFrontApp Style) -->
              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.enhancedButton.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.enhancedButton.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="space-y-8">
                  <!-- Size Variants -->
                  <div class="space-y-4">
                    <h3 class="text-size-16 font-semibold text-base-80">{{ t('playground.enhancedButton.sizesTitle') }}</h3>
                    <div class="flex flex-wrap items-center gap-4">
                      <Button size="xs">{{ t('playground.enhancedButton.xsButton') }}</Button>
                      <Button size="sm">{{ t('playground.enhancedButton.smButton') }}</Button>
                      <Button size="md">{{ t('playground.enhancedButton.mdButton') }}</Button>
                      <Button size="lg">{{ t('playground.enhancedButton.lgButton') }}</Button>
                      <Button size="xl">{{ t('playground.enhancedButton.xlButton') }}</Button>
                    </div>
                  </div>

                  <Separator />

                  <!-- Color Variants -->
                  <div class="space-y-4">
                    <h3 class="text-size-16 font-semibold text-base-80">{{ t('playground.enhancedButton.variantsTitle') }}</h3>
                    <div class="flex flex-wrap gap-4">
                      <Button variant="primary">{{ t('playground.enhancedButton.defaultButton') }}</Button>
                      <Button variant="error">{{ t('playground.enhancedButton.errorButton') }}</Button>
                      <Button variant="positive">{{ t('playground.enhancedButton.positiveButton') }}</Button>
                      <Button variant="usually">{{ t('playground.enhancedButton.usuallyButton') }}</Button>
                      <Button variant="assistant">{{ t('playground.enhancedButton.assistantButton') }}</Button>
                      <Button variant="info">{{ t('playground.enhancedButton.infoButton') }}</Button>
                    </div>
                  </div>

                  <Separator />

                  <!-- Style Variants -->
                  <div class="space-y-4">
                    <h3 class="text-size-16 font-semibold text-base-80">{{ t('playground.enhancedButton.stylesTitle') }}</h3>
                    <div class="flex flex-wrap gap-4">
                      <Button button-style="filled">{{ t('playground.enhancedButton.filledButton') }}</Button>
                      <Button button-style="outlined">{{ t('playground.enhancedButton.outlinedButton') }}</Button>
                      <Button button-style="text">{{ t('playground.enhancedButton.textButton') }}</Button>
                    </div>
                  </div>

                  <Separator />

                  <!-- Features -->
                  <div class="space-y-4">
                    <h3 class="text-size-16 font-semibold text-base-80">{{ t('playground.enhancedButton.featuresTitle') }}</h3>
                    <div class="flex flex-wrap gap-4">
                      <Button block>{{ t('playground.enhancedButton.blockButton') }}</Button>
                      <Button round>{{ t('playground.enhancedButton.roundButton') }}</Button>
                      <Button :loading="isButtonLoading" @click="handleLoadingClick">
                        {{ t('playground.enhancedButton.loadingButton') }}
                      </Button>
                      <Button>
                        <Heart class="mr-2 h-4 w-4" />
                        {{ t('playground.enhancedButton.withIconLeft') }}
                      </Button>
                      <Button>
                        {{ t('playground.enhancedButton.withIconRight') }}
                        <ChevronRight class="ml-2 h-4 w-4" />
                      </Button>
                      <Button>
                        <Download class="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <Separator />

                  <!-- States -->
                  <div class="space-y-4">
                    <h3 class="text-size-16 font-semibold text-base-80">{{ t('playground.enhancedButton.statesTitle') }}</h3>
                    <div class="flex flex-wrap gap-4">
                      <Button disabled>{{ t('playground.enhancedButton.disabledButton') }}</Button>
                      <Button variant="error" disabled>{{ t('playground.enhancedButton.disabledButton') }}</Button>
                      <Button button-style="outlined" disabled>{{ t('playground.enhancedButton.disabledButton') }}</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.toggle.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.toggle.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <Toggle v-model="toggleValue" aria-label="Toggle italic">
                    <Italic class="h-4 w-4" />
                  </Toggle>
                  <p class="text-size-14 text-base-60">{{ t('playground.toggle.pressed') }}: {{ toggleValue }}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.toggleGroup.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.toggleGroup.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <ToggleGroup v-model="toggleGroupValue" type="single">
                    <ToggleGroupItem value="left" aria-label="Align left">
                      <Bold class="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="center" aria-label="Align center">
                      <Italic class="h-4 w-4" />
                    </ToggleGroupItem>
                    <ToggleGroupItem value="right" aria-label="Align right">
                      <Underline class="h-4 w-4" />
                    </ToggleGroupItem>
                  </ToggleGroup>
                  <p class="text-size-14 text-base-60">{{ t('playground.toggleGroup.selected') }}: {{ toggleGroupValue }}</p>
                </CardContent>
              </Card>
            </TabsContent>

            <!-- Data Display Tab -->
            <TabsContent value="data" class="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.badge.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.badge.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="flex flex-wrap gap-2">
                  <Badge variant="base">{{ t('playground.button.base') }}</Badge>
                  <Badge variant="primary">{{ t('playground.button.primary') }}</Badge>
                  <Badge variant="info">{{ t('playground.button.info') }}</Badge>
                  <Badge variant="positive">{{ t('playground.button.positive') }}</Badge>
                  <Badge variant="error">{{ t('playground.button.error') }}</Badge>
                  <Badge variant="warning">{{ t('playground.button.warning') }}</Badge>
                  <Badge variant="outline">{{ t('playground.button.outline') }}</Badge>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.avatar.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.avatar.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="flex gap-4">
                  <Avatar>
                    <AvatarImage src="https://github.com/shadcn.png" />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <Avatar>
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.table.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.table.description') }}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{{ t('playground.table.name') }}</TableHead>
                        <TableHead>{{ t('playground.table.status') }}</TableHead>
                        <TableHead>{{ t('playground.table.role') }}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell>{{ t('playground.table.johnDoe') }}</TableCell>
                        <TableCell><Badge variant="positive">{{ t('playground.table.active') }}</Badge></TableCell>
                        <TableCell>{{ t('playground.table.admin') }}</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell>{{ t('playground.table.janeSmith') }}</TableCell>
                        <TableCell><Badge variant="warning">{{ t('playground.table.pending') }}</Badge></TableCell>
                        <TableCell>{{ t('playground.table.user') }}</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.separator.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.separator.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div>{{ t('playground.separator.contentAbove') }}</div>
                  <Separator />
                  <div>{{ t('playground.separator.contentBelow') }}</div>
                </CardContent>
              </Card>
            </TabsContent>

            <!-- Feedback Tab -->
            <TabsContent value="feedback" class="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.spinner.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.spinner.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="flex items-center gap-4">
                  <Spinner />
                  <Spinner class="h-8 w-8" />
                  <Spinner class="h-12 w-12" />
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.skeleton.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.skeleton.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="space-y-2">
                    <Skeleton class="h-4 w-full" />
                    <Skeleton class="h-4 w-4/5" />
                    <Skeleton class="h-4 w-3/5" />
                  </div>
                  <div class="flex items-center space-x-4">
                    <Skeleton class="h-12 w-12 rounded-full" />
                    <div class="space-y-2 flex-1">
                      <Skeleton class="h-4 w-full" />
                      <Skeleton class="h-4 w-2/3" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <!-- Overlays Tab -->
            <TabsContent value="overlays" class="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.popover.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.popover.description') }}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Popover>
                    <PopoverTrigger as-child>
                      <Button button-style="outlined">
                        {{ t('playground.popover.openButton') }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-80">
                      <div class="space-y-2">
                        <h4 class="font-medium">{{ t('playground.popover.popoverTitle') }}</h4>
                        <p class="text-size-14 text-base-60">
                          {{ t('playground.popover.popoverContent') }}
                        </p>
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.calendar.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.calendar.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <Popover v-model:open="isCalendarOpen">
                    <PopoverTrigger as-child>
                      <Button button-style="outlined" class="w-full justify-start">
                        <CalendarIcon class="mr-2 h-4 w-4" />
                        {{ displayDate }}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent class="w-auto p-0">
                      <Calendar v-model="calendarDate" @update:model-value="handleDateSelect" :locale="locale" />
                    </PopoverContent>
                  </Popover>
                  <div class="space-y-2 text-size-14">
                    <div class="flex justify-between">
                      <span class="text-base-60">{{ t('playground.calendar.formatBasic') }}:</span>
                      <span class="font-medium">{{ formattedDate }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-base-60">{{ t('playground.calendar.formatLocalized') }}:</span>
                      <span class="font-medium">{{ localizedDate }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-base-60">{{ t('playground.calendar.formatRelative') }}:</span>
                      <span class="font-medium">{{ relativeDate }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="text-base-60">{{ t('playground.calendar.weekday') }}:</span>
                      <span class="font-medium">{{ weekdayName }}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.drawer.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.drawer.description') }}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Drawer>
                    <DrawerTrigger as-child>
                      <Button button-style="outlined" class="w-full">
                        {{ t('playground.drawer.openButton') }}
                      </Button>
                    </DrawerTrigger>
                    <DrawerContent>
                      <DrawerHeader>
                        <DrawerTitle>{{ t('playground.drawer.drawerTitle') }}</DrawerTitle>
                        <DrawerDescription>{{ t('playground.drawer.drawerDescription') }}</DrawerDescription>
                      </DrawerHeader>
                      <div class="p-4">
                        <div class="space-y-4">
                          <Input :placeholder="t('playground.input.placeholder')" variant="filled" />
                          <Textarea :placeholder="t('playground.textarea.placeholder')" variant="filled" />
                        </div>
                      </div>
                      <DrawerFooter>
                        <Button>{{ t('playground.drawer.submit') }}</Button>
                        <DrawerClose as-child>
                          <Button button-style="outlined">{{ t('playground.drawer.cancel') }}</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </DrawerContent>
                  </Drawer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.dialog.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.dialog.description') }}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Dialog>
                    <DialogTrigger as-child>
                      <Button button-style="outlined" class="w-full">
                        {{ t('playground.dialog.openButton') }}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{{ t('playground.dialog.dialogTitle') }}</DialogTitle>
                        <DialogDescription>{{ t('playground.dialog.dialogDescription') }}</DialogDescription>
                      </DialogHeader>
                      <div class="space-y-4 py-4">
                        <Input :placeholder="t('playground.input.placeholder')" variant="filled" />
                        <Textarea :placeholder="t('playground.textarea.placeholder')" variant="filled" />
                      </div>
                      <DialogFooter>
                        <DialogClose as-child>
                          <Button button-style="outlined">{{ t('playground.dialog.close') }}</Button>
                        </DialogClose>
                        <Button>{{ t('playground.dialog.confirm') }}</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </TabsContent>

            <!-- Navigation Tab -->
            <TabsContent value="navigation" class="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.accordion.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.accordion.description') }}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible class="w-full">
                    <AccordionItem value="item-1">
                      <AccordionTrigger>{{ t('playground.accordion.item1Title') }}</AccordionTrigger>
                      <AccordionContent>
                        {{ t('playground.accordion.item1Content') }}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-2">
                      <AccordionTrigger>{{ t('playground.accordion.item2Title') }}</AccordionTrigger>
                      <AccordionContent>
                        {{ t('playground.accordion.item2Content') }}
                      </AccordionContent>
                    </AccordionItem>
                    <AccordionItem value="item-3">
                      <AccordionTrigger>{{ t('playground.accordion.item3Title') }}</AccordionTrigger>
                      <AccordionContent>
                        {{ t('playground.accordion.item3Content') }}
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.pagination.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.pagination.description') }}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Pagination
                    v-slot="{ page }"
                    :total="100"
                    :items-per-page="10"
                    :sibling-count="1"
                    show-edges
                    :default-page="1"
                  >
                    <PaginationContent v-slot="{ items }" class="flex items-center gap-1">
                      <PaginationFirst />
                      <PaginationPrevious />

                      <template v-for="(item, index) in items">
                        <PaginationItem v-if="item.type === 'page'" :key="index" :value="item.value" as-child>
                          <Button
                            :button-style="item.value === page ? 'filled' : 'outlined'"
                            size="sm"
                            :variant="item.value === page ? 'primary' : 'assistant'"
                            :class="item.value !== page ? '!text-base-80' : ''"
                          >
                            {{ item.value }}
                          </Button>
                        </PaginationItem>
                        <PaginationEllipsis v-else :key="item.type" :index="index" />
                      </template>

                      <PaginationNext />
                      <PaginationLast />
                    </PaginationContent>
                  </Pagination>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

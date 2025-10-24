<script setup lang="ts">
import {computed, ref} from 'vue'
import type {DateValue} from '@internationalized/date'
import {useI18n} from 'vue-i18n'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import {SidebarInset, SidebarProvider} from '@/components/ui/sidebar'
import {Button} from '@/components/ui/button'
import {Input} from '@/components/ui/input'
import {Textarea} from '@/components/ui/textarea'
import {Checkbox} from '@/components/ui/checkbox'
import {Switch} from '@/components/ui/switch'
import {RadioGroup, RadioGroupItem} from '@/components/ui/radio-group'
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select'
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
import {Bold, Calendar as CalendarIcon, Italic, Underline} from 'lucide-vue-next'
import {useDate} from '@/composables/useDate'

const {t, locale} = useI18n()

const inputValue = ref('')
const textareaValue = ref('')
const checkboxValue = ref(false)
const switchValue = ref(false)
const radioValue = ref('option1')
const selectValue = ref('')
const toggleValue = ref(false)
const toggleGroupValue = ref('center')
const calendarDate = ref<DateValue>()
const isCalendarOpen = ref(false)

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
      <main class="min-h-screen p-6">
        <div class="mx-auto max-w-7xl space-y-8">
          <!-- Header -->
          <div class="space-y-2">
            <h1 class="text-size-32 font-bold">{{ t('playground.title') }}</h1>
            <p class="text-base-60">{{ t('playground.description') }}</p>
          </div>

          <!-- Tabs for organized sections -->
          <Tabs default-value="inputs" class="w-full">
            <TabsList class="grid w-full grid-cols-5">
              <TabsTrigger value="inputs">{{ t('playground.tabs.inputs') }}</TabsTrigger>
              <TabsTrigger value="buttons">{{ t('playground.tabs.buttons') }}</TabsTrigger>
              <TabsTrigger value="data">{{ t('playground.tabs.data') }}</TabsTrigger>
              <TabsTrigger value="feedback">{{ t('playground.tabs.feedback') }}</TabsTrigger>
              <TabsTrigger value="overlays">{{ t('playground.tabs.overlays') }}</TabsTrigger>
            </TabsList>

            <!-- Inputs Tab -->
            <TabsContent value="inputs" class="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.input.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.input.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <Input v-model="inputValue" :placeholder="t('playground.input.placeholder')" />
                  <p class="text-size-14 text-base-60">{{ t('playground.input.value') }}: {{ inputValue }}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.textarea.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.textarea.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <Textarea v-model="textareaValue" :placeholder="t('playground.textarea.placeholder')" />
                  <p class="text-size-14 text-base-60">{{ t('playground.input.value') }}: {{ textareaValue }}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.checkbox.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.checkbox.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <div class="flex items-center space-x-2">
                    <Checkbox id="terms" v-model:checked="checkboxValue" />
                    <label for="terms" class="text-size-14 font-medium">{{ t('playground.checkbox.acceptTerms') }}</label>
                  </div>
                  <div class="flex items-center space-x-2">
                    <Switch id="airplane" v-model:checked="switchValue" />
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
            </TabsContent>

            <!-- Buttons Tab -->
            <TabsContent value="buttons" class="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.button.variants') }}</CardTitle>
                  <CardDescription>{{ t('playground.button.variantsDesc') }}</CardDescription>
                </CardHeader>
                <CardContent class="flex flex-wrap gap-4">
                  <Button variant="primary">{{ t('playground.button.primary') }}</Button>
                  <Button variant="base">{{ t('playground.button.base') }}</Button>
                  <Button variant="info">{{ t('playground.button.info') }}</Button>
                  <Button variant="positive">{{ t('playground.button.positive') }}</Button>
                  <Button variant="error">{{ t('playground.button.error') }}</Button>
                  <Button variant="warning">{{ t('playground.button.warning') }}</Button>
                  <Button variant="outline">{{ t('playground.button.outline') }}</Button>
                  <Button variant="ghost">{{ t('playground.button.ghost') }}</Button>
                  <Button variant="link">{{ t('playground.button.link') }}</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.button.sizes') }}</CardTitle>
                  <CardDescription>{{ t('playground.button.sizesDesc') }}</CardDescription>
                </CardHeader>
                <CardContent class="flex flex-wrap items-center gap-4">
                  <Button size="sm">{{ t('playground.button.small') }}</Button>
                  <Button size="default">{{ t('playground.button.default') }}</Button>
                  <Button size="lg">{{ t('playground.button.large') }}</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{{ t('playground.toggle.title') }}</CardTitle>
                  <CardDescription>{{ t('playground.toggle.description') }}</CardDescription>
                </CardHeader>
                <CardContent class="space-y-4">
                  <Toggle v-model:pressed="toggleValue" aria-label="Toggle italic">
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
                      <Button variant="outline">
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
                      <Button variant="outline" class="w-full justify-start">
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
                      <Button variant="outline" class="w-full">
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
                          <Input :placeholder="t('playground.input.placeholder')" />
                          <Textarea :placeholder="t('playground.textarea.placeholder')" />
                        </div>
                      </div>
                      <DrawerFooter>
                        <Button>{{ t('playground.drawer.submit') }}</Button>
                        <DrawerClose as-child>
                          <Button variant="outline">{{ t('playground.drawer.cancel') }}</Button>
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
                      <Button variant="outline" class="w-full">
                        {{ t('playground.dialog.openButton') }}
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>{{ t('playground.dialog.dialogTitle') }}</DialogTitle>
                        <DialogDescription>{{ t('playground.dialog.dialogDescription') }}</DialogDescription>
                      </DialogHeader>
                      <div class="space-y-4 py-4">
                        <Input :placeholder="t('playground.input.placeholder')" />
                        <Textarea :placeholder="t('playground.textarea.placeholder')" />
                      </div>
                      <DialogFooter>
                        <DialogClose as-child>
                          <Button variant="outline">{{ t('playground.dialog.close') }}</Button>
                        </DialogClose>
                        <Button>{{ t('playground.dialog.confirm') }}</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </SidebarInset>
  </SidebarProvider>
</template>

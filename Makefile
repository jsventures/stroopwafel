MAKEFLAGS = --no-print-directory --always-make --silent
MAKE = make $(MAKEFLAGS)

dev:
	@echo "Booting up dev server..."
	npx expo start --go

debug:
	@echo "Making debug build..."
	eas build -p ios --profile debug

preview:
	@echo "Making preview build..."
	eas build -p ios --profile preview

prod:
	@echo "Making production build..."
	eas build -p ios

submit:
	@echo "Submitting latest production build to app store..."
	eas submit -p ios --latest

.PHONY: all

all: finneganswake00joycuoft.epub ulysses00joyc_1.epub

finneganswake00joycuoft.epub:
	@if command -v curl > /dev/null; then \
		curl -fSL -o $@ "https://archive.org/download/finneganswake00joycuoft/finneganswake00joycuoft.epub"; \
	elif command -v wget > /dev/null; then \
		wget -O $@ "https://archive.org/download/finneganswake00joycuoft/finneganswake00joycuoft.epub"; \
	else \
		echo "Error: Neither curl nor wget available."; exit 1; \
	fi
	@if command -v unzip > /dev/null; then \
		unzip -q -o $@ 2>/dev/null || true; \
	fi

ulysses00joyc_1.epub:
	@if command -v curl > /dev/null; then \
		curl -fSL -o $@ "https://archive.org/download/ulysses00joyc_1/ulysses00joyc_1.epub"; \
	elif command -v wget > /dev/null; then \
		wget -O $@ "https://archive.org/download/ulysses00joyc_1/ulysses00joyc_1.epub"; \
	else \
		echo "Error: Neither curl nor wget available."; exit 1; \
	fi
